import React, { Component } from 'react';
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  RefinementList,
  HierarchicalMenu
} from 'react-instantsearch/dom';
// Import the connector
import {
  connectHierarchicalMenu,
} from 'react-instantsearch/connectors';
import qs from "qs";
import PropTypes from "prop-types";

const updateAfter = 700;

const createURL = state => `?${qs.stringify(state)}`;

const searchStateToUrl = (props, searchState) =>
  searchState ? `${props.location.pathname}${createURL(searchState)}` : "";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchState: qs.parse(props.location.search.slice(1)),
      showMore: false
    };
  }

  onSearchStateChange = searchState => {
    clearTimeout(this.debouncedSetState);
    this.debouncedSetState = setTimeout(() => {
      this.props.history.push(
        searchStateToUrl(this.props, searchState),
        searchState
      );
    }, updateAfter);
    this.setState({ searchState });
  };

  onShowMore = () => {
    this.setState({showMore: !this.state.showMore})
  }

  render() {
    return (
      <InstantSearch
       appId="latency"
       apiKey="3d9875e51fbd20c7754e65422f7ce5e1"
       indexName="instant_search"
       searchState={this.state.searchState}
       onSearchStateChange={this.onSearchStateChange.bind(this)}
       createURL={createURL}
     >
       <header className="header">
         <SearchBox translation={{placeholder: 'Search For Product'}}/>
       </header>
       <div className="content-wrapper">
         <div className="results-wrapper">
           {/* add the widget/connector
           params can be found here: https://community.algolia.com/react-instantsearch/connectors/connectHierarchicalMenu.html */}
           <ConnectedNestedList
             limitMax={80}
             limitMin={8}
             showMore={this.state.showMore}
             onShowMore={this.onShowMore}
             transformItems={ (item) => item }
             attributes={['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2', 'hierarchicalCategories.lvl3']}
           />
           <Hits hitComponent={Hit}/>
         </div>
       </div>

    </InstantSearch>

    );
  }
}

App.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  location: PropTypes.object.isRequired
};

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

//The connector definition:
const NestedList = function({ id, items, refine, showMore, onShowMore }) {
  function findHierarchy(items){
    {/*recursive function to find most specific items that should be displayed
    items is a nested object of lvl0 with lvl1 as a nested object */}
    if(items == null){
      return [];
    }
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
        //define the pills
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
    <button onClick={e=> {
      e.preventDefault();
      onShowMore();
    }}>{showMore ? "Show Less" : "Show More"}</button>

    </div>
  );
};

// define this:
const ConnectedNestedList = connectHierarchicalMenu(NestedList);

export default App;
