import React, { Component, useEffect, useState } from 'react';

import './timeline.css';
import { timeline } from './timeline.js';


let wordPressGraphQL = 'https://patrickdoran.com/headless/graphql'


function buildTimeline(){
  useEffect(() => {
 
    console.log('lifecycle')
  }, []);

}


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
        query: `
          {
          posts {
            edges {
              node {
                excerpt
                date
                postId
                title
                content
              }
            }
          }
          }
        `,
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data.data.posts.edges);
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
      return <p>Loading ...</p>;
    }

    return (
      <div className='timeline' data-mode='horizontal' data-rtl-mode='true' data-force-vertical-mode='300'>
        <div className='timeline__wrap'>
          <div className='timeline__items'>
            {results.map(result =>
              <div className='timeline__item' key={result.node.postId}>
                <div className='timeline__content'>
                  {result.node.title}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default PatrickDoranTimeline;
