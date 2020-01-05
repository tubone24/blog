import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import React from "react";
import {graphql, StaticQuery} from "gatsby";

const getLastYearDate = () => {
    const today = new Date();
    today.setFullYear( today.getFullYear() - 1 );
    return today
}

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
            }
          }
        }
      }
    }
    `}
        render={data => <Heatmap data={data} {...props} />}
    />
)

