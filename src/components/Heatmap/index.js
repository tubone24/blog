import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import React from "react";
import {graphql, StaticQuery} from "gatsby";

const getLastYearDate = () => {
    const today = new Date();
    today.setFullYear( today.getFullYear() - 1 );
    return today
}

const getSlug = (event, value) => {
    console.log(value)
}

const getTooltipDataAttrs = (value) => {
    if (!value || !value.date) {
        return null;
    }

    return {
        'data-tip': `${value.date.toISOString().slice(0, 10)} has count: ${value.count}`,
    };

};

const Heatmap = ({data}) => {
    const {allMarkdownRemark} = data;
    const mapping = {};
    const values = [];

    allMarkdownRemark.edges.forEach(({node}) => {
        const {date} = node.frontmatter;
        if (mapping[date]) {
            mapping[date] += 1;
        } else {
            mapping[date] = 1;
        }
    });

    Object.keys(mapping).forEach( (date) => {
        values.push({date: date, count: mapping[date]})
    });

    return (<CalendarHeatmap
        startDate={getLastYearDate()}
        endDate={new Date()}
        values={values}
        showMonthLabels={true}
        showWeekdayLabels={true}
        onMouseOver={getSlug}
        tooltipDataAttrs={getTooltipDataAttrs}
    />)
};

export default props => (
    <StaticQuery
        query={graphql`
    query {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              date(formatString: "YYYY-MM-DD")
              slug
              title
            }
          }
        }
      }
    }
    `}
        render={data => <Heatmap data={data} {...props} />}
    />
)

