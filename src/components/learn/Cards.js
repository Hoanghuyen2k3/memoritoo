import Card from '../quiz/Card';
import React, {useState } from 'react'
import { useOutletContext } from 'react-router-dom';
function Cards() {
    const [image, setImage] = useState(null);
    const quizzes = useOutletContext();
    if (!quizzes || quizzes.length === 0) {
      return <div>Empty ... 🥹</div>;
    }
  return (
    <div>
        <Card quiz={quizzes} image={image} setImage={setImage} />
    </div>
  )
}

export default Cards