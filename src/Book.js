import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Nav from './Nav';
import Cookies from 'universal-cookie';
import * as qs from 'query-string';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

/**********

https://medium.com/@levvi/how-to-use-google-forms-as-a-free-email-service-for-your-custom-react-form-or-any-other-1aa837422a4
https://github.com/llevvi/llevvi.github.io/blob/development/src/components/ContactBox/index.js

action:
https://docs.google.com/forms/u/0/d/e/1FAIpQLSfP3h3OMYzztYQuYS4NxPDo5XsLfH49cVNI_i8biLsse__jAQ/formResponse

language:
entry.801858234

type:
entry.1528636563

from:
entry.1516521361_day
entry.1516521361_month
entry.1516521361_year

to:
entry.1536514253_day
entry.1536514253_month
entry.1536514253_year

name:
entry.1984478491

email:
entry.1350212508

telephone:
entry.966320764

/**********/

const querystring = qs.parse(window.location.search);
const cookies = new Cookies();
const CopyApi = 'https://raw.githubusercontent.com/bearslairs/bearslairs-data/master/copy';
const languages = ['bg', 'en', 'ru'];

class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //value: '',
      language: 'en',
      booking: {
        from: null,
        to: null,
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
    //this.setState({value: event.target.value});
    this.setState(state => ({
      language: state.language,
      booking: state.booking,
      copy: state.copy
    }));
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  componentDidMount() {
    fetch(CopyApi + '/' + this.state.language + '/book.json')
    .then(responseCopyApi => responseCopyApi.json())
    .then((copy) => {
      this.setState(state => ({
        language: state.language,
        booking: state.booking,
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
        </Row>
        <Row style={{ paddingTop: '10px' }}>

          <Form>
            <Form.Group controlId="name">
              <Form.Label>name</Form.Label>
              <Form.Control type="text" placeholder="full name" value={this.state.booking.telephone} onChange={this.handleChange} />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>email</Form.Label>
              <Form.Control type="email" placeholder="email" value={this.state.booking.email} onChange={this.handleChange} />
              <Form.Text className="text-muted">
                we'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="telephone">
              <Form.Label>telephone</Form.Label>
              <Form.Control type="text" placeholder="telephone number" value={this.state.booking.telephone} onChange={this.handleChange} />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group controlId="reservation">
              <Form.Label>reservation dates</Form.Label>
              <br />
              <DateRangePicker
                startDate={this.state.booking.from} // momentPropTypes.momentObj or null,
                startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                endDate={this.state.booking.to} // momentPropTypes.momentObj or null,
                endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
                focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
              />
            </Form.Group>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Label>i would like to book storage</Form.Label>
              <Form.Check type="radio" label="in a small locker" />
              <Form.Check type="radio" label="in a medium locker" />
              <Form.Check type="radio" label="in a large locker" />
              <Form.Check type="radio" label="for a bicycle" />
              <Form.Check type="radio" label="for a motorcycle" />
              <Form.Check type="radio" label="for a large motorcycle" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Row>
        <Row>
          <pre>
            {
              (window.location.hostname === 'localhost')
                ? JSON.stringify(this.state, null, 2)
                : ''
            }
          </pre>
        </Row>
      </Container>
    );
  }
}
export default Book;