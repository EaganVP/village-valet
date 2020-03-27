import React, {Component} from "react";
import {connect} from "react-redux";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import {Autocomplete, LoadScript} from "@react-google-maps/api";

//import './pic_placeholder.png';

class RideInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.autocomplete = null;

        this.onLoad = this.onLoad.bind(this);
        this.onPlaceChanged = this.onPlaceChanged.bind(this)
    }

    handleChange(event){
        let label_flag = event.target.id.split("_");
        if (label_flag[1] === "date"){
            //updating the date
            this.props.updateScheduler(label_flag[1], null, event.target.value);
            console.log(event.target.value)
        } else {
            //updating the location
            this.props.updateScheduler(label_flag[1], label_flag[2], event.target.value)


        }
    };

    onLoad(autocomplete) {
        console.log('autocomplete: ', autocomplete);

        this.autocomplete = autocomplete
    }

    onPlaceChanged() {
        if (this.autocomplete !== null) {
            const place = this.autocomplete.getPlace();
            console.log(<place className="geometry location"></place>);
            this.props.active_ride.locations.dropoff.address = place.formatted_address;
        } else {
            console.log('Autocomplete is not loaded yet!')
        }
    }

    render() {
        return (
            <Container className="RideInformation" style={{minWidth: "100%"}}>
                <h1>Ride Information</h1>
                <Row>
                    <Col>
                        <Row>
                            <Form.Control readOnly type="text" placeholder="First Name" value={this.props.active_ride.rider.first_name}/>
                            <Form.Control readOnly type="text" placeholder="Last Name" value={this.props.active_ride.rider.last_name}/>
                        </Row>
                        <Row>
                            <Form.Control type="date" placeholder="" id='sched_date' onChange={this.handleChange} value={this.props.active_ride.ride_data.date}/>
                        </Row>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col xs={1}/>
                    <Col xs={10}>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th></th>
                                <th>Pickup</th>
                                <th>Dropoff</th>
                                <th>Return</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Address</td>
                                <td><Form.Control type="text" placeholder="Pickup Location" id='sched_pickup_address' onChange={this.handleChange} value={this.props.active_ride.locations.pickup.address}/></td>
                                <td>
                                    <LoadScript
                                        id="script-loader"
                                        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_TOKEN}
                                        libraries={["places"]}
                                    >
                                        <Autocomplete
                                            onLoad={this.onLoad}
                                            onPlaceChanged={this.onPlaceChanged}
                                        >
                                            <Form.Control type="text" placeholder="Dropoff Location"
                                                          id='sched_dropoff_address' onChange={this.handleChange}
                                                          value={this.props.active_ride.locations.dropoff.address}/>
                                        </Autocomplete>
                                    </LoadScript>
                                </td>
                                <td><Form.Control type="text" placeholder="Return" id='sched_return_address' onChange={this.handleChange} value={this.props.active_ride.locations.return.address}/></td>
                            </tr>
                            <tr>
                                <td>Special Instructions</td>
                                <td><Form.Control type="text" placeholder="Pickup Instructions" id='sched_pickup_special' onChange={this.handleChange} value={this.props.active_ride.locations.pickup.special}/></td>
                                <td><Form.Control type="text" placeholder="Dropoff Instructions" id='sched_dropoff_special' onChange={this.handleChange} value={this.props.active_ride.locations.dropoff.special}/></td>
                                <td><Form.Control type="text" placeholder="Return Instructions" id='sched_return_special' onChange={this.handleChange} value={this.props.active_ride.locations.return.special}/></td>
                            </tr>
                            <tr>
                                <td>Time</td>
                                <td><Form.Control type="time" placeholder="pickup time" id='sched_pickup_time' onChange={(e) => this.handleChange(e)} value={this.props.active_ride.locations.pickup.time}/></td>
                                <td></td>
                                <td><Form.Control type="time" placeholder="return time" id='sched_return_time' onChange={(e) => this.handleChange(e)} value={this.props.active_ride.locations.return.time}/></td>
                            </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    active_ride: state.active_ride
});

const mapDispatchToProps = dispatch => ({
    updateScheduler: (type, field, value) => dispatch({
        type: "scheduler",
        payload: {
            type: type,
            field: field,
            value: value
        }
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(RideInformation);
