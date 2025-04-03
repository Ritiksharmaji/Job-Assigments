import React, { useState, useEffect } from 'react';

const App = () => {
  const [boxes, setBoxes] = useState(Array(9).fill(null).map((_, i) => ({
    id: i,
    color: null,
    clickOrder: null
  })));
  const [clickCounter, setClickCounter] = useState(0);
  const [lastBoxClicked, setLastBoxClicked] = useState(false);

  const handleBoxClick = (id) => {
    if (lastBoxClicked) return; // Prevent clicks during orange animation
    
    const newBoxes = [...boxes];
    const boxIndex = newBoxes.findIndex(box => box.id === id);
    
    // If box is already green, do nothing
    if (newBoxes[boxIndex].color === 'green') return;
    
    // Update the clicked box
    newBoxes[boxIndex] = {
      ...newBoxes[boxIndex],
      color: 'green',
      clickOrder: clickCounter + 1
    };
    
    setBoxes(newBoxes);
    setClickCounter(clickCounter + 1);
    
    // Check if this was the last box
    if (newBoxes.filter(box => box.color === 'green').length === 9) {
      setLastBoxClicked(true);
    }
  };

  useEffect(() => {
    if (!lastBoxClicked) return;
    
    // Get boxes that were clicked, in order of clicking
    const clickedBoxes = boxes
      .filter(box => box.clickOrder !== null)
      .sort((a, b) => a.clickOrder - b.clickOrder);
    
    // Change each box to orange with a delay
    clickedBoxes.forEach((box, index) => {
      setTimeout(() => {
        const newBoxes = [...boxes];
        const boxIndex = newBoxes.findIndex(b => b.id === box.id);
        newBoxes[boxIndex] = {
          ...newBoxes[boxIndex],
          color: 'orange'
        };
        setBoxes(newBoxes);
        
        // Reset after last box turns orange
        if (index === clickedBoxes.length - 1) {
          setTimeout(() => {
            setLastBoxClicked(false);
            setClickCounter(0);
          }, 500);
        }
      }, index * 500); // 500ms delay between each box
    });
  }, [lastBoxClicked]);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 100px)',
      gridGap: '10px',
      margin: '20px'
    }}>
      {boxes.map((box) => (
        <div
          key={box.id}
          onClick={() => handleBoxClick(box.id)}
          style={{
            width: '100px',
            height: '100px',
            backgroundColor: box.color || 'lightgray',
            border: '1px solid gray',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '24px',
            transition: 'background-color 0.3s ease'
          }}
        >
          {box.clickOrder && !lastBoxClicked && box.clickOrder}
        </div>
      ))}
    </div>
  );
};

export default App;