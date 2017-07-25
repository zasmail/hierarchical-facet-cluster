import React, { Component } from 'react';
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  RefinementList,
  HierarchicalMenu
} from 'react-instantsearch/dom';

import {
  connectSearchBox,
  connectRefinementList,
  connectHierarchicalMenu,
  connectSortBy,
  connectInfiniteHits,
  connectCurrentRefinements,
} from 'react-instantsearch/connectors';

const Hit = ({hit}) =>
  <article className="hit">
    <div className="product-picture-wrapper">
       <div className="product-picture">
         <img src={hit.image}/>
       </div>
    </div>
    <div className="product-desc-wrapper">
      <div className="product-name">
        <Highlight attributeName="name" hit={hit}/>
      </div>
      <div className="product-type">
        <Highlight attributeName="description" hit={hit}/>
      </div>
    </div>
    <div className="ais-StarRating__ratingLink">
      <div className="product-price">${hit.price}</div>
    </div>
  </article>

const NestedList = function({ id, items, refine }) {
  function findHierarchy(items){
    if(items.length == 0){
      return items;
    }
    var refinedItem = items.find(function(item){
      return item.isRefined;
    });
    if(refinedItem){
      return findHierarchy(refinedItem.items);
    } else{
      return items;
    }
  }
  return (
    <div className="faf-tabs-and-content-container">
      <ul className="image-facets-pills">{
        findHierarchy(items).map((item, idx) =>
        <li
          className="image-facets-pill"
          onClick={e=> {
            e.preventDefault();
            refine(item.value);
          }}
        >
          <span className="image-facets-pill-text-count-wrapper">
            <a className="image-facets-pill-text">{item.label}</a>
            <span className="image-facets-pill-count">{item.count}</span>
          </span>
        </li>
      )}</ul>
    </div>
  );
};

const Content = () =>
  <div className="results-wrapper">
    <ConnectedNestedList
      limitMax="8"
      limitMin="8"
      attributes={['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2', 'hierarchicalCategories.lvl3']}
    />
    <Hits hitComponent={Hit}/>
  </div>

class App extends Component {
  render() {
    return (
      <InstantSearch
       appId="latency"
       apiKey="3d9875e51fbd20c7754e65422f7ce5e1"
       indexName="instant_search">
       <header className="header">
         <SearchBox translation={{placeholder: 'Search For Product'}}/>
       </header>
       <div className="content-wrapper">
         <Content />
       </div>

    </InstantSearch>

    );
  }
}

const ConnectedNestedList = connectHierarchicalMenu(NestedList);


export default App;
