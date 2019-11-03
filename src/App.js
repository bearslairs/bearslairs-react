import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import './App.css';
import Cookies from 'universal-cookie';

//import { withRouter } from 'react-router-dom';
import * as qs from 'query-string';

//import queryString from 'query-string'

const querystring = qs.parse(window.location.search);
const cookies = new Cookies();
const CopyApi = 'https://raw.githubusercontent.com/bearslairs/bearslairs-data/master/copy';

class App extends Component {
  state = {
    language: 'en',
    copy: {
      title: '',
      subtitle: '',
      carousel: [],
      blurbs: [],
      cards: []
    }
  };

  componentDidMount() {
    //let qs = queryString.parse(this.props.location.search, { ignoreQueryPrefix: true });
    if (cookies.get('lang') === null || cookies.get('lang') === undefined || (querystring.lang !== undefined && querystring.lang !== null)) {
      this.state.language = (querystring.lang !== undefined && querystring.lang !== null)
        ? querystring.lang
        : 'en';
      cookies.set('lang', this.state.language, { path: '/' });
    }
    fetch(CopyApi + '/' + this.state.language + '/home.json')
    .then(responseCopyApi => responseCopyApi.json())
    .then((copy) => {
      this.setState(currentState => ({
        language: currentState.language,
        copy: copy
      }));
    })
    .catch(console.log);
  }
  render() {
    return (
      <Container>
        <header className="App-header clearfix">
          <h1 className="float-left">{this.state.copy.title}</h1>
          <h2 className="float-left text-muted">{this.state.copy.subtitle}</h2>
          <span className="float-right text-muted">
            <a href="/?lang=bg" className="text-muted">bg</a>
            <a href="/?lang=en">en</a>
            <a href="/?lang=ru" className="text-muted">ru</a>
          </span>
        </header>
        <Row style={{ paddingTop: '10px' }}>
          <Carousel>
            {
              this.state.copy.carousel.map((carouselItem) => (
                <Carousel.Item>
                  <Image src={carouselItem.image.url} alt={carouselItem.image.alt} fluid rounded />
                  <Carousel.Caption>
                    <h3>{carouselItem.title}</h3>
                    <p>{carouselItem.description}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))
            }
          </Carousel>
        </Row>
        <Row style={{ paddingTop: '10px' }}>
          {
            this.state.copy.blurbs.map((blurb) => (
              <div>
                <h4>{blurb.title}</h4>
                {
                  blurb.copy.map((paragraph) => (
                    <p>{paragraph}</p>
                  ))
                }
              </div>
            ))
          }
        </Row>
        <Row style={{ paddingTop: '10px' }}>
          {
            this.state.copy.cards.map((card) => (
              <Card style={{ width: '30%', marginRight: '10px' }}>
                <Card.Header as="h3">
                  {card.title}
                  <Image src={card.icon.url} alt={card.icon.alt} fluid rounded style={{ marginRight: '10px' }} className="float-right" />
                </Card.Header>
                <Card.Img variant="top" src={card.image.url} alt={card.image.alt} fluid rounded />
                <Card.Body>
                  <Card.Title>
                    {card.description.join(' ')}
                  </Card.Title>
                  <hr />
                  <Card.Text>
                    <ul>
                      {
                        card.features.map((feature) => (
                          <li>
                            {feature.text}
                            <ul>
                              {
                                feature.details.map((detail) => (
                                  <li>{detail}</li>
                                ))
                              }
                            </ul>
                          </li>
                        ))
                      }
                    </ul>
                    <Button variant="primary" className="float-right">{card.button.text}</Button>
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          }
        </Row>
      </Container>
    );
  }
}

export default App;
