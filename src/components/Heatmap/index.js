import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import React from "react";
import ReactTooltip from 'react-tooltip';
import {graphql, StaticQuery} from "gatsby";

import {gotoPage} from '../../api/url';

const getLastYearDate = () => {
    const today = new Date();
    today.setFullYear( today.getFullYear() - 1 );
    return today
};

const getLast5MonthDate = () => {
    const today = new Date();
    today.setMonth( today.getMonth() - 5 );
    return today
};

const getSlug = (value) => {
    if (!value || !value.date) {
        return null;
    }

    const {slug} = value;
    gotoPage(slug);
};

const getTooltipDataAttrs = (value) => {
    if (!value || !value.date) {
        return null;
    }

    if (value.count === 1) {
        return {
            'data-tip': `${value.date} has ${value.count} post`,
        };
    } else {
        return {
            'data-tip': `${value.date} has ${value.count} posts`,
        };
    }

};

const Heatmap = ({data, minify=false}) => {
    const {allMarkdownRemark} = data;
    const mapping = {};
    const slugs = {};
    const values = [];

    let startDate;

    if (minify) {
        startDate = getLast5MonthDate()
    } else {
        startDate = getLastYearDate()
    }

    allMarkdownRemark.edges.forEach(({node}) => {
        const {date, slug} = node.frontmatter;
        if (mapping[date]) {
            mapping[date] += 1;
        } else {
            mapping[date] = 1;
        }
        slugs[date] = slug;
    });

    Object.keys(mapping).forEach( (date) => {
        values.push({date: date, count: mapping[date], slug: slugs[date]})
    });

    return (
      <>
       <CalendarHeatmap
        startDate={startDate}
        endDate={new Date()}
        values={values}
        showMonthLabels={true}
        showWeekdayLabels={true}
        onClick={getSlug}
        tooltipDataAttrs={getTooltipDataAttrs}
      />
      <ReactTooltip />
    </>)
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

