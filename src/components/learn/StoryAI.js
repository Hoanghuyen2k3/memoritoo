import React from 'react'
import {useState} from 'react'
import { useOutletContext } from 'react-router-dom';
import "./StoryAI.scss"
import axios from 'axios';
import Loading from '../loading/Loading';

function StoryAI() {
    const [loading, setLoading] = useState(false);

    const quizzes = useOutletContext();
    const [title, setTitle] = useState('');
    const [bodyStory, setBody] = useState('');
    const content = quizzes.map(q=>q.content.term);
    const [imgTitle, setImgTitle] = useState();
    const contentTerm = content.filter(e => !e.includes('\n'));
    console.log(contentTerm);

    const extractBodyAndTitle = (messages) => {
      const lines = messages.split('\n');
      const body = [];
      const title = [];
        for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();     
        if (line.startsWith('Title:')) {
          const answer = line.substring('Answer:'.length).trim();
          title.push(answer);
        }
        else {
          body.push(line);     
        }
      }  
      return { body, title };
    };
  
    const fetchingContent = async () => {
      const response = await axios.post('https://memoritoo-server.onrender.com/story', {
        contentTerm: contentTerm
      });
      console.log(response);
      const { body, title } = extractBodyAndTitle(response.data.answer);
      setBody(body);
      setTitle(title);
  
      const image = await axios.post('https://memoritoo-server.onrender.com/image', {
        title: title
      });
      console.log(image);
      setImgTitle(image.data.data[0].url);
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      setLoading(true); // Set loading to true immediately
  
      try {
        await fetchingContent();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false when the API calls are complete or in case of an error
      }
    };
  

    if (!quizzes || quizzes.length === 0) {
      return <div>Empty ... 🥹</div>;
    }
  
    return (
      loading ? <Loading />: (
      title ?
      <div className="story-container">
          
        <button onClick={handleSubmit}>New Story</button>
        {
          loading ? <Loading />: (
            <div className="story">
            <div className="img">
              {imgTitle&&<img src={imgTitle} alt={title} />}
            </div>
            <div className="content">
              {title&&<h2>{title}</h2>}
              {bodyStory&&<textarea readOnly value={bodyStory.join('\n')}></textarea>}
            </div>   
          </div>
          )
        }
      </div>
      :(
      <div className="story-no">  
        <button onClick={handleSubmit}>New Story</button>
      </div>
      ))
    );
  };

export default StoryAI

