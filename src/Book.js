import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Nav from './Nav';
import Cookies from 'universal-cookie';
import * as qs from 'query-string';

/**********
https://medium.com/@levvi/how-to-use-google-forms-as-a-free-email-service-for-your-custom-react-form-or-any-other-1aa837422a4
https://github.com/llevvi/llevvi.github.io/blob/development/src/components/ContactBox/index.js
/**********/

const querystring = qs.parse(window.location.search);
const cookies = new Cookies();
const CopyApi = 'https://raw.githubusercontent.com/bearslairs/bearslairs-data/master/copy';
const languages = ['bg', 'en', 'ru'];

class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      language: 'en',
      booking: {
      	from: new Date(),
      	to: new Date(),
      	name: '',
      	email: '',
      	telephone: '',
      	type: '',
      	language: ''
      },
      copy: {
        languages: []
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  componentDidMount() {
    fetch(CopyApi + '/' + this.state.language + '/book.json')
    .then(responseCopyApi => responseCopyApi.json())
    .then((copy) => {
      this.setState(prevState => ({
        language: prevState.language,
        copy: copy
      }));
    })
    .catch(console.log);
  }
  render() {
    return (
      <Container>
        <Nav />
        <Row style={{ paddingTop: '10px' }}>
    	  <h2>make a booking</h2>
    	  <form onSubmit={this.handleSubmit}>
    	    <input type='email' name='email' value={this.state.email} onChange={this.handleChange} />
    	    <textarea name='message' value={this.state.message} onChange={this.handleChange} />
    	    <button type='submit'>Submit</button>
    	  </form>
        </Row>
      </Container>
    );
  }
}
export default Book;