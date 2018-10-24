import React, {Component} from 'react';
import {Context} from "./App";
import Image from "./Image";
import logo from "../images/daiict.png";
import {Link, withRouter} from "react-router-dom";
import AuthorizedComponent from "./AuthorizedComponent";
import {isAdmin, isStudent, isSuperAdmin} from "../helper/userType";

function NavLink({path, text, onClick, className, currPath, icon}) {
    if (currPath) {
        currPath = "/" + currPath.split('/')[1];
    }

    return (
        <li className={"nav-item " + (currPath === path ? "active" : "") + " " + className}
            style={{marginLeft: "10px", marginRight: "10px"}}>
            <Link className="nav-link" onClick={onClick} to={{
                pathname: path,
            }}>
                <i className={"fa fa-" + icon} style={{marginRight: "5px"}}/>
                {text}
            </Link>
        </li>
    )
}

class NavigationBar extends Component {
    render() {
        return (
            <Context.Consumer>{
                value => {
                    return (
                        <div>
                            <Image src={logo} className={'logo'}/>
                            <nav className="navbar navbar-expand-lg navbar-dark nav-custom bg-dark">
                                <button className="navbar-toggler" type="button" data-toggle="collapse"
                                        data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown"
                                        aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                                    <ul className="navbar-nav ml-5 mr-3">
                                        <NavLink path={'/'}
                                                 text={"Home"}
                                                 icon='home'
                                                 currPath={this.props.location.pathname}/>
                                        <NavLink path={'/service'}
                                                 text={'Services'}
                                                 icon={'handshake-o'}
                                                 currPath={this.props.location.pathname}/>
                                        <NavLink text={isAdmin(value.user) ? "All Orders" : "My Orders"}
                                                 icon={isAdmin(value.user) ? 'list-ul' : 'shopping-basket'}
                                                 path={'/order'}
                                                 currPath={this.props.location.pathname}/>
                                        <AuthorizedComponent permission={isStudent(value.user)}
                                                             path={'/cart'}
                                                             currPath={this.props.location.pathname}
                                                             component={NavLink}
                                                             icon={'cart-plus'}
                                                             text={"My Cart"}/>
                                        <AuthorizedComponent permission={isSuperAdmin(value.user)}
                                                             path={'/users'}
                                                             icon={'users'}
                                                             currPath={this.props.location.pathname}
                                                             component={NavLink}
                                                             text={"Users"}/>
                                        <NavLink path={'/Myprofile'}
                                                 icon={'user'}
                                                 currPath={this.props.location.pathname}
                                                 text={'My Profile'}/>
                                        <AuthorizedComponent permission={isAdmin(value.user)}
                                                             path={'/parameter'}
                                                             icon={'cog'}
                                                             currPath={this.props.location.pathname}
                                                             text={'Parameters'}
                                                             component={NavLink}/>
                                        <AuthorizedComponent permission={isAdmin(value.user)}
                                                             path='/collectionType'
                                                             icon='archive'
                                                             currPath={this.props.location.pathname}
                                                             text={'CollectionTypes'}
                                                             component={NavLink}/>
                                        <AuthorizedComponent permission={isSuperAdmin(value.user)}
                                                             path='/permission'
                                                             icon={'lock'}
                                                             currPath={this.props.location.pathname}
                                                             text={'Permissions'}
                                                             component={NavLink}/>
                                        <AuthorizedComponent permission={isAdmin(value.user)}
                                                             path='/helpAdmin'
                                                             currPath={this.props.location.pathname}
                                                             text={'Help'}
                                                             icon={'question-circle'}
                                                             component={NavLink}/>
                                        <AuthorizedComponent permission={isStudent(value.user)}
                                                             path='/helpUser'
                                                             currPath={this.props.location.pathname}
                                                             text={'Help'}
                                                             icon={'question-circle'}
                                                             component={NavLink}/>
                                        <AuthorizedComponent permission={isSuperAdmin(value.user)}
                                                             path='/dashboard'
                                                             currPath={this.props.location.pathname}
                                                             text={'Dashboard'}
                                                             icon={'line-chart'}
                                                             component={NavLink}/>
                                        <NavLink text={'Logout'}
                                                 icon={'sign-out'}
                                                 className={"ml-auto"}
                                                 path={this.props.location.pathname}
                                                 currPath={""}
                                                 onClick={value.logOut}/>
                                    </ul>
                                </div>
                            </nav>
                        </div>)
                }}
            </Context.Consumer>
        );
    }
}

export default withRouter(NavigationBar);
