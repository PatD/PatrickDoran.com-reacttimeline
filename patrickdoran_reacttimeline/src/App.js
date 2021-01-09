import React, { Component /* ,useEffect, useState */ } from 'react';
import './timeline.css';
import { timeline } from './timeline.js';

// GraphQL endpoint and query:
const wordPressGraphQL = 'https://patrickdoran.com/headless/graphql'
const wordPressGraphQLquery = `{
  posts(first:50, where: {categoryName: "Timeline", orderby: {field: DATE, order: ASC}}) {
    edges {
      node {
        date
        postId
        title
      }
    }
  }
}`;

// function buildTimeline(){
//   useEffect(() => {
 
//     console.log('lifecycle')
//   }, []);

// }


// Component for an individual timeline entry
const PatrickDoranTimelineEntry = (props)=>{
  return (
        <div className='timeline__content'>
          <strong><time dateTime={props.entryDate}>{props.entryDate}</time></strong>
          <p><em>{props.entryTitle}</em></p>
        </div>
  )
}


// Make a React Component that loads data into a timeline.
class PatrickDoranTimeline extends Component {

  constructor(props) {
    super(props);

    this.state = {
      results: [],
      isLoading: false
    };
  }

  componentDidMount() {

    this.setState({ isLoading: true })

    fetch(wordPressGraphQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query:wordPressGraphQLquery,
      })
    })
      .then(response => response.json())
      .then(data => {
        // console.log('Success:', data.data.posts.edges);
        let results = data.data.posts.edges
        this.setState({ results, isLoading: false })
      })
      .catch((error) => {
        console.error('Error:', error);
      })
  }

  

  componentDidUpdate() {
    const { results } = this.state;

    if (results.length > 0) {
      timeline(document.querySelectorAll('.timeline'));
    }
  }
  


  render() {
    const { results, isLoading } = this.state;

    if (isLoading) {
      return <p>Loading Timeline ...</p>;
    }

    return (
      <div className='timeline' data-mode='horizontal' data-rtl-mode='true' data-visible-items="5">
        <div className='timeline__wrap'>
          <div className='timeline__items'>
            {results.map(result =>
              <div className='timeline__item' key={result.node.postId}>
                  <PatrickDoranTimelineEntry 
                    entryTitle={result.node.title} 
                    entryDate={result.node.date.substr(0,4)} 
                  />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default PatrickDoranTimeline;
