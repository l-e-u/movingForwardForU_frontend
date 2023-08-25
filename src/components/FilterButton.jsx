import React from 'react'
import Button from './Button';

const FilterButton = ({ handleClick }) => (
   <Button handleClick={handleClick}>
      <i className='bi bi-sliders2'></i>
   </Button>
);

export default FilterButton;