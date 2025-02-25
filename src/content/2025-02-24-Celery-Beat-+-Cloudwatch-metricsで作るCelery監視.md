---
slug: 2025-02-24/Celery-Beat-+-Cloudwatch-metricsで作るCelery監視
title: "Celery Beat + Cloudwatch metricsで作るCelery監視"
date: 2025-02-24T08:52:25+0000
description: Celery Beat + Cloudwatch metricsで作るCelery監視
tags:
  - AWS
  - Celery
  - Cloudwatch
headerImage: https://i.imgur.com/I26bo16.png
templateKey: blog-post
---

少しずつあったかくなってきましたね。

## Table of Contents

```toc

```

## Celeryとは？

[Celery](https://github.com/celery/celery)はPythonベースの**オープンソース非同期タスクキュー/ジョブキュー**です。

Celeryは、分散[メッセージパッシング](https://e-words.jp/w/%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E3%83%91%E3%83%83%E3%82%B7%E3%83%B3%E3%82%B0.html#google_vignette)の考え方に基づいた思想で作られており、Webサーバーのワークロードから**重たい処理**を切り出すことが可能で、非同期でタスクを実行し、タスクのスケジューリング、タスクの結果の取得を簡単に実装できます。

例えば、以下のような用途で使われます。

- メール送信
  - 一括メール送信などWebサーバーから長時間ワークロードを切り離す
- ファイル/メディア処理
  - ファイルのフォーマット変換など
  - 画像のリサイズなど

メッセージパッシングを自前で実装すると結構苦労しますが、Celeryを使うことで次のように**デコレーター**で簡単に実装できます。

```python
from celery import Celery

app = Celery('tasker',
             backend='redis://127.0.0.1:6379/0',
             broker='redis://127.0.0.1:6379/0')

@app.task
def add(a, b):
    return a + b

# タスクの実行
result = add.delay(4, 5).get()
```

普通のPythonの関数とほぼ同じ書き味でとても簡単ですね。

### ちょっとだけCeleryのおさらい

このあと、用語がバンバン飛び交うのでCeleryの基本をおさらいしていきましょう。

まずCeleryは以下の要素で構成されています。

- [Tasks](https://docs.celeryq.dev/en/stable/userguide/tasks.html#tasks): Celery workerで実行される関数で、@taskデコレータを使用して通常のPython関数の実装のまま、CeleryのTaskとして登録できます。登録されたTaskはBroker経由でWorkerへ送信され、Workerによって処理されます。

- [Broker](https://docs.celeryq.dev/en/stable/getting-started/backends-and-brokers/index.html#broker-overview): Taskの要求をWorkerとのメッセージの仲介役として機能し、[Redis](https://redis.io/)や[RabbitMQ](https://www.rabbitmq.com/), AWSなら[SQS](https://aws.amazon.com/jp/sqs/)が主にサポートされています。

- [Result Backend](https://docs.celeryq.dev/en/stable/getting-started/backends-and-brokers/): Taskの実行結果を保存する場所。Workerが処理したTask(関数の戻り)を保存します。戻りの記録が不要であれば省略も可能です。[Redis](https://redis.io/)や[MongoDB](https://www.mongodb.com/)などのNoSQLだけでなく、ORM([SQLAlchemy](https://www.sqlalchemy.org/))経由でRDBも対応してます。AWSなら[DynamoDB](https://aws.amazon.com/jp/dynamodb/)、[S3](https://aws.amazon.com/jp/s3/)などがサポートされています。[Async Result](https://docs.celeryq.dev/en/stable/reference/celery.app.task.html#celery.app.task.Task.AsyncResult)を使うことで、Taskの中間結果を取得できます。

- [Worker](https://docs.celeryq.dev/en/stable/userguide/workers.html#guide-workers): 実際にTaskを実行するプロセス。celerydが常駐プロセスとして動作します。

例えば[FastAPI](https://fastapi.tiangolo.com/ja/)と絡めた動きとしては、以下の図のようになります。

![img](https://i.imgur.com/vFkl2kl.png)

BrokerとResult Backendは、例えば[RabbitMQ](https://www.rabbitmq.com/)、[MongoDB](https://www.mongodb.com/)などそれぞれPub/Sub、データベースの専用の製品で構成できますが、[Redis](https://redis.io/)で両方を兼ねて構成できます。

ちなみにAWSでCeleryを絡めた構成をつくるならこのような形で構成されることが多いです。

![img](https://i.imgur.com/w00OL0K.png)

## Celeryの監視困ってませんか？

Celeryを使っていると、**タスクがどれくらい進んでいるのか**、**どれくらいのタスクが残っているのか**、**どれくらいのタスクが失敗しているのか**、などの情報が欲しくなります。

そしてできれば、Celery Workerの**AutoScaring**のためのメトリクスも欲しいですよね。

よく紹介される方法としては、[Flower](https://flower.readthedocs.io/en/latest/)を使う方法があります。

![img](https://i.imgur.com/kdNrqwz.png)

Flowerは、Celeryのタスクの状態を見るためのWebベースのツールで、上記のようにタスクの状態をリアルタイムで確認できます。

加えて、 **/metrics**エンドポイントを使って[Prometheus](https://prometheus.io/)などの監視ツールと連携することで、Celery Workerのメトリクスを取得できます。

一般的にCeleryの監視といえばFlowerが有名ですが、開発用用途を除き**リアルタイムでのタスクの可視化**だけ実施していてもあまり意味はなく、Flower + Prometheus + [Grafana](https://grafana.com/ja/)などの組み合わせで**時系列の可視化**、[AlertManager](https://prometheus.io/docs/alerting/latest/alertmanager/)を入れてアラートの発報をすることが多いです。

専用にPrometheusなどの監視ツール一式を立てるのは、ちょっと面倒ですよね。

## Celery Beat + Control Inspect + CloudWatch metricsで作るCelery監視

そこで今回は、[Celery Beat](https://docs.celeryq.dev/en/latest/userguide/periodic-tasks.html#introduction) + [Control Inspect](https://docs.celeryq.dev/en/latest/reference/celery.app.control.html#celery.app.control.Control.inspect) + [Amazon CloudWatch metrics](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)を使って、Celeryの監視を行ってみます。

Flowerを使わずに、Celery Beatで定期的にタスクの状態を取得し、CloudWatch metricsに送信することで、Celeryの監視を行ないます。

## Celery Beat

[Celery Beat](https://docs.celeryq.dev/en/latest/userguide/periodic-tasks.html#introduction)は、Celeryの**スケジューラー**です。Celery Beatを使うと、登録しているタスクを定期的に実行できます。

![img](https://i.imgur.com/6TIgeYT.png)

Celery Beatは、Celery Workerとは**別のプロセス**として動作し、（同じプロセスで実行可能ですが本番ではおすすめできません）Celery Workerがタスクを実行するのに対して、Celery Beatは**タスクのスケジューリング**を行ないます。

次のようにCelery **config**に実行したいタスクを登録し、スケジュールを**秒数**または**CronTab**で記載することで、定期的にタスクを実行できます。

```python
from celery import Celery
from celery.schedules import crontab

celery = Celery('myapp', broker='redis://localhost:6379/0')

celery.conf.timezone = 'UTC' # タイムゾーンの設定が必要
celery.conf.beat_schedule = {
    'scheduled-task': {
        'task': 'scheduled_task',
        'schedule': 60.0  # 60秒ごとに実行
        # もしくは、cronで指定
        # 'schedule': crontab(minute='*/1')
    }
}

@celery.task(name='scheduled_task')
def scheduled_task():
    # 何らかスケジュール実行したい処理
```

そして、Celery Workerとは別に、Celery Beatを起動することで、定期的にタスクを実行できます。

```bash
celery --app=myapp beat -l debug
```

また、-Bオプションをつけることで、Celery WorkerとCelery Beatを同時に起動できます。(本番では推奨されない構成です。)

```bash
celery --app=myapp worker -B
```

今回はメトリックの定期的な取得のためにBeatでスケジュール登録していきます。

## Celery Control Inspect

[celery.app.control.inspect](https://docs.celeryq.dev/en/latest/reference/celery.app.control.html#celery.app.control.Control.inspect)は、Celery workerの**状態を監視・検査するためのAPI**です。

このインターフェースを使用することで、実行中のTaskやWorkerの状態を確認できます。

例えば次の通り、Control Inspectを使って、実行中のTaskのmetricを取得してAmazon Cloudwatch metricsに送信できます。

```python
import boto3
from celery import Celery
from datetime import datetime

celery = Celery('myapp', broker='redis://localhost:6379/0')

@celery.task(name='send_worker_metric')
def send_worker_metric():
  
    # Control Inspectを使って、workerの状態を取得
    inspector = celery.control.inspect()
    
    # 各種メトリクスの収集
    active = inspector.active() or {} # 実行中のタスク
    reserved = inspector.reserved() or {} # 予約中のタスク
    stats = inspector.stats() or {} # ワーカーのステータス
    revoked = inspector.revoked() or {} # 取り消されたタスク
    scheduled = inspector.scheduled() or {} # スケジュールされたタスク
    metrics = []

    # 全体の集計用
    total_metrics = {
        'active_tasks': 0,
        'reserved_tasks': 0,
        'revoked_tasks': 0,
        'scheduled_tasks': 0,
        'worker_status': len(stats),  # アクティブなワーカー数
        'processed_tasks': 0,
        'failed_tasks': 0,
        'retried_tasks': 0,
        'succeeded_tasks': 0,
        'memory_usage': 0
    }

    # ワーカーごとのメトリクス収集
    for worker_name, worker_stats in stats.items():
        worker_metrics = {
            'active_tasks': len(active.get(worker_name, [])),
            'reserved_tasks': len(reserved.get(worker_name, [])),
            'revoked_tasks': len(revoked.get(worker_name, [])),
            'scheduled_tasks': len(scheduled.get(worker_name, [])),
            'worker_status': 1,
            'processed_tasks': worker_stats.get('total', {}).get('processed', 0),
            'failed_tasks': worker_stats.get('total', {}).get('failed', 0),
            'retried_tasks': worker_stats.get('total', {}).get('retried', 0),
            'succeeded_tasks': worker_stats.get('total', {}).get('succeeded', 0)
        }

        # メモリ使用量の追加
        if 'rusage' in worker_stats:
            worker_metrics['memory_usage'] = worker_stats['rusage'].get('maxrss', 0)

        # 全体の集計に加算
        for metric_name, value in worker_metrics.items():
            total_metrics[metric_name] += value
            if metric_name == 'worker_status':
                continue  # worker_statusは合計しない

        # 個別ワーカーのメトリクス作成
        for metric_name, value in worker_metrics.items():
            metric_data = {
                'MetricName': metric_name,
                'Value': float(value),
                'Unit': 'Count',
                'Timestamp': datetime.timestamp(datetime.now()),
                'Dimensions': [
                    {'Name': 'WorkerName', 'Value': worker_name}
                ]
            }
            if metric_name == 'memory_usage':
                metric_data['Unit'] = 'Megabytes'
            metrics.append(metric_data)

    # 全体のメトリクスを追加
    timestamp = datetime.timestamp(datetime.now())
    for metric_name, value in total_metrics.items():
        metric_data = {
            'MetricName': metric_name,
            'Value': float(value),
            'Unit': 'Count',
            'Timestamp': timestamp,
            'Dimensions': []  # ディメンションなしで全体のメトリクスを送信
        }
        if metric_name == 'memory_usage':
            metric_data['Unit'] = 'Megabytes'
        metrics.append(metric_data)

    # CloudWatchへの送信
    if metrics:
        try:
            cloudwatch = boto3.client('cloudwatch')
            # CloudWatchのAPI制限に対応するため、20メトリクスずつ分割して送信
            for i in range(0, len(metrics), 20):
                chunk = metrics[i:i + 20]
                cloudwatch.put_metric_data(
                    Namespace='CeleryMetrics',
                    MetricData=chunk
                )
            return {'status': 'success', 'metrics_count': len(metrics), 'metrics': metrics}
        except Exception as e:
            raise
```

コツとしては、Cloudwatch metricsのディメンションでWorkerごとにメトリクスを分けつつ、**アラート用に全体のメトリクス(ディメンションなしのメトリクス)も送信**することです。

Workerの名前は、ホスト名やプロセスIDなどで決まってしまうため（任意に設定はできますがオートスケーリングと相性が良くないため）、ディメンションなしで全体のメトリクスを送信することで、全体のメトリクスを確認できるようにしています。

Cloudwatch metricsで確認すると、次のように正しくメトリクスが送信されていることが確認できます。

![img](https://i.imgur.com/ndDxoTD.png)

## アラートとECSのAWS Application Auto Scaling

Cloudwatch metricsにメトリクスが送信されたら、次は**アラートを設定**していきます。

metricsの名前空間は**CeleryMetrics**としているので、次のようなTerraformからアラートが設定できます。

```hcl
resource "aws_cloudwatch_metric_alarm" "celery_active_tasks" {
  alarm_name          = "celery-active-tasks-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name        = "active_tasks"
  namespace          = "CeleryMetrics"
  period             = "60"
  statistic          = "Average"
  threshold          = 10 # FIXME: あなたのアプリの閾値に合わせてください
  alarm_description  = "アクティブなタスク数が閾値を超えた場合のアラート"
  alarm_actions      = [aws_sns_topic.alert.arn]

  dimensions = {
  }
}

resource "aws_cloudwatch_metric_alarm" "celery_worker_status" {
  alarm_name          = "celery-worker-status-alarm"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "2"
  metric_name        = "worker_status"
  namespace          = "CeleryMetrics"
  period             = "60"
  statistic          = "Minimum"
  threshold          =  10 # FIXME: あなたのアプリの閾値に合わせてください
  alarm_description  = "ワーカーがダウンした場合のアラート"
  alarm_actions      = [aws_sns_topic.alert.arn]

  dimensions = {
  }
}

# メモリ使用量のアラート
resource "aws_cloudwatch_metric_alarm" "celery_memory_usage" {
  alarm_name          = "celery-memory-usage-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "memory_usage"
  namespace          = "CeleryMetrics"
  period             = "300"  # 5分
  statistic          = "Maximum"
  threshold          = 2049 # FIXME: あなたのアプリの閾値に合わせてください
  alarm_description  = "Celeryワーカーのメモリ使用量が2GBを超えた場合のアラート"
  alarm_actions      = [aws_sns_topic.alert.arn]

  dimensions = {
  }
}

# 失敗タスクのアラート
resource "aws_cloudwatch_metric_alarm" "celery_failed_tasks" {
  alarm_name          = "celery-failed-tasks-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "failed_tasks"
  namespace          = "CeleryMetrics"
  period             = "300"  # 5分
  statistic          = "Sum"
  threshold          = "5" # FIXME: あなたのアプリの閾値に合わせてください
  alarm_description  = "Celeryタスクの失敗が5回を超えた場合のアラート"
  alarm_actions      = [aws_sns_topic.alert.arn]

  dimensions = {
  }
}

# リトライタスクのアラート
resource "aws_cloudwatch_metric_alarm" "celery_retried_tasks" {
  alarm_name          = "celery-retried-tasks-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "retried_tasks"
  namespace          = "CeleryMetrics"
  period             = "300"  # 5分
  statistic          = "Sum"
  threshold          = "10" # FIXME: あなたのアプリの閾値に合わせてください
  alarm_description  = "Celeryタスクのリトライが10回を超えた場合のアラート"
  alarm_actions      = [aws_sns_topic.alert.arn]

  dimensions = {
  }
}

# 予約済みタスクのアラート（キューの詰まり検知）
resource "aws_cloudwatch_metric_alarm" "celery_reserved_tasks" {
  alarm_name          = "celery-reserved-tasks-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "reserved_tasks"
  namespace          = "CeleryMetrics"
  period             = "300"  # 5分
  statistic          = "Average"
  threshold          = 10 # FIXME: あなたのアプリの閾値に合わせてください
  alarm_description  = "予約済みタスクが多すぎる場合のアラート"
  alarm_actions      = [aws_sns_topic.alert.arn]

  dimensions = {
  }
}

resource "aws_sns_topic" "alert" {
  name = "celery-alerts"
}
```

さらにECS serviceは[AWS Application Auto Scaling](https://docs.aws.amazon.com/ja_jp/autoscaling/application/userguide/what-is-application-auto-scaling.html)を使って、**Celery WorkerのAutoScaring**を行なうこともできます。

```hcl
resource "aws_appautoscaling_target" "ecs_target_worker" {
  max_capacity       = var.worker_max_desire_count
  min_capacity       = var.worker_min_desire_count
  resource_id        = "service/xxxxx/xxxx" # FIXME: あなたのECSのリソースIDに合わせてください(service/cluster_name/service_name)
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

# アクティブタスク数に基づくスケーリングポリシー
resource "aws_appautoscaling_policy" "worker_tasks" {
  name               = "worker-tasks-autoscaling"
  policy_type        = "StepScaling"
  resource_id        = aws_appautoscaling_target.ecs_target_worker.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target_worker.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target_worker.service_namespace

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown               = 300
    metric_aggregation_type = "Average"

    step_adjustment {
      metric_interval_lower_bound = 0
      metric_interval_upper_bound = 10
      scaling_adjustment          = 1
    }

    step_adjustment {
      metric_interval_lower_bound = 10
      scaling_adjustment          = 2
    }
  }
}
```

作成したスケーリングポリシーを先ほど作成したアラートアクションに追加することで、アクティブタスク数に基づいてオートスケーリングを行なうことができます。

```hcl
resource "aws_cloudwatch_metric_alarm" "celery_active_tasks" {
  alarm_name          = "celery-active-tasks-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name        = "active_tasks"
  namespace          = "CeleryMetrics"
  period             = "60"
  statistic          = "Average"
  threshold          = 10 # FIXME: あなたのアプリの閾値に合わせてください
  alarm_description  = "アクティブなタスク数が閾値を超えた場合のアラート"
  alarm_actions      = [aws_sns_topic.alert.arn, aws_appautoscaling_policy.worker_tasks.arn]

  dimensions = {
  }
}
```

これで、Celery Workerの監視とAutoScaringを行なうことができます。

構成図にするとこのような形です。

![img](https://i.imgur.com/I26bo16.png)

## 結論

Celery Beat + Control Inspect + Amazon CloudWatch metricsを使って、Celeryの監視方法を紹介しました。

Flowerを使わずに、Celery Beatで定期的にタスクの状態を取得し、CloudWatch metricsに送信することで、Celeryの監視を行なうことができますので、ぜひお試しください。
