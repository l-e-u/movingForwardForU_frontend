import {useState,useEffect} from 'react';

const QuerySearchSelect=({documents, property})=>{
  const[query, setQuery]=useState('');
  const [suggestions, setSuggestions]=useState(documents);
  
  return(
    <div>
    <input
    type='text'
    className='form-control'
    value={query}/>
    </div>
    );
};

export default QuerySearchSelect;