import React, {Component} from 'react';
import NavigationBar from "../../NavigationBar";
import Service from "./Service";
import Stapes from "../../service/Stapes";
import {Link} from "react-router-dom";
import {asyncFetch, syncFetch} from "../../../helper/FetchData";
import _ from "lodash"
import Spinner from "../../Spinner";
import {domainUrl} from "../../../config/configuration";
import * as HttpStatus from "http-status-codes";
import $ from "jquery";

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state={
            showSpinner: false,
            cart: []
        };
        this.asyncFetch = asyncFetch.bind(this);
    }

    findAvailableCollectionTypes = () => {
        this.syncFetch = syncFetch.bind(this);
        let collectionType = this.syncFetch('collectionType');
        const orders = this.state.cart.orders;
        let availableCollectionType = _.map(collectionType,'_id');
        _.forEach(orders,(order)=>{
            availableCollectionType = _.intersection(availableCollectionType,order.service.collectionTypes)
        })
        collectionType = _.filter(collectionType,(o) => _.some(availableCollectionType,(x) => x===o._id));
        return collectionType;
    }

    componentDidMount(){
        this.asyncFetch('cart');
    }

    updateOrder = (newOrder,index,modal) => {
        this.setState({
            showSpinner: true
        });
        const oldOrder = this.state.cart.orders[index];
        const that = this;
        const url = domainUrl + '/order/' + oldOrder._id;
        const request = new XMLHttpRequest();
        request.open('PATCH', url, true);
        request.withCredentials = true;
        request.setRequestHeader("Content-type", "application/json");
        request.onload = function () {
            if (this.status == HttpStatus.OK) {
                $(modal).modal('hide');
                that.asyncFetch('cart');
            }
        };
        request.send(JSON.stringify(newOrder));
    };

    deleteOrder = (index) => {
        this.setState({
            showSpinner: true
        });
        const that = this;
        const url = domainUrl + '/order/' + this.state.cart.orders[index]._id;
        const request = new XMLHttpRequest();
        request.open('DELETE', url, true);
        request.withCredentials = true;
        request.setRequestHeader("Content-type", "application/json");
        request.onload = function () {
            if (this.status === HttpStatus.OK) {
                that.asyncFetch('cart');
            }
        }
        request.send();
    }

    render() {

        if(this.state.cart.length==0 || this.state.cart.orders.length===0){
            return (
                <div>
                    <NavigationBar/>
                    <Stapes active={1}/>
                    <div className="container cart-empty mt-4">
                        <h1> Your cart is empty! </h1>
                        <Link to={'/service'} className='mt-4'>
                            <div className="btn btn-primary">
                                {"GO, ADD SERVICES"} </div>
                        </Link>
                    </div>
                    <Spinner open={this.state.showSpinner}/>
                </div>
            )
        }

        const avilableCollectionTypes = this.findAvailableCollectionTypes();
        return (
            <div>
                <NavigationBar/>
                <Stapes active={1}/>
                <div className="container">
                    <table id="cart" className="table table-hover table-condensed">
                        <thead>
                        <tr>
                            <th style={{"width": "26%"}}>Service</th>
                            <th style={{"width": "18%"}}>Parameters</th>
                            <th style={{"width": "6%"}}>Price</th>
                            <th style={{"width": "6%"}}>Quantity</th>
                            <th style={{"width": "10%"}} className="text-center">Service Cost</th>
                            <th style={{"width": "12%"}} className="text-center">Parameter Cost</th>
                            <th style={{"width": "12%"}} className="text-center">Subtotal</th>
                            <th style={{"width": "10%"}}></th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            _.map(this.state.cart.orders,(o,i) => <Service key={o._id}
                                                                           order={o}
                                                                           index={i}
                                                                           updateOrder={this.updateOrder}
                                                                           deleteOrder={this.deleteOrder}/>)
                        }
                        </tbody>
                        <tfoot>
                        <tr className="visible-xs">
                            <td colSpan="6" className="hidden-xs">
                                <div className={"alert alert-danger p-2 mt-2 mb-2" + (avilableCollectionTypes.length>0?' d-none':'')}>
                                    <strong>{'Collection Type Not matching for this Services, Please Order Separately!'}</strong></div>
                            </td>
                            <td className="text-center"><strong>{`Total: ₹ ${this.state.cart.totalCost}`}</strong></td>
                            <td className="hidden-xs"></td>
                        </tr>
                        <tr>
                            <td>
                                <Link to={'/service'}>
                                    <div className="btn btn-warning">
                                        <i className="fa fa-angle-left"></i>
                                        {" Add More Services"} </div>
                                </Link>
                            </td>
                            <td colSpan="6" className="hidden-xs"></td>
                            <td>
                                <Link to={{pathname:'/info',state: {
                                    avilableCollectionTypes: avilableCollectionTypes
                                }}} className={`${avilableCollectionTypes.length==0?'disabled-link':''}`}>
                                    <div className={`btn btn-success`}>
                                        {"Checkout "}
                                        <i className="fa fa-angle-right"></i>
                                    </div>
                                </Link>
                                </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                <Spinner open={this.state.showSpinner}/>
            </div>
        );
    }
}

export default Cart;

