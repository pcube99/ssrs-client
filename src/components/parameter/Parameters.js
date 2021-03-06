import React, {Component} from 'react';
import NavigationBar from "../NavigationBar";
import Header from "../Header";
import ParameterList from "./ParameterList";
import {makeCall} from "../../helper/caller";
import {handleError} from "../../helper/error";
import _ from 'lodash';

class Parameters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parameter: []
        }
    }

    componentDidMount() {
        this.getAllParameter();
    }

    getAllParameter = () => {
        makeCall({
            jobType: "GET",
            urlParams: '/parameter'
        })
            .then((response) => {
                let sortedParameters = _.sortBy(response.parameter, (parameter) => {
                    return parameter.name;
                });
                this.setState({
                    parameter: sortedParameters
                })
            })
            .catch((error) => {
                handleError(error);
            })
    }

    toggleParameter = (index) => {
        const parameter = this.state.parameter[index];
        makeCall({
            jobType: 'PATCH',
            urlParams: '/parameter/changeStatus/' + parameter._id,
            params: {isActive: !parameter.isActive}
        })
            .then((response) => {
                const parameterList = this.state.parameter;
                parameterList[index] = response.parameter;
                this.setState({
                    parameter: parameterList,
                });
            })
            .catch((error) => {
                handleError(error);
            })
    };

    deleteParameter = (index) => {
        makeCall({
            jobType: 'DELETE',
            urlParams: '/parameter/' + this.state.parameter[index]._id
        })
            .then(() => {
                const parameter = this.state.parameter;
                this.setState({
                    parameter: [...parameter.slice(0, index), ...parameter.slice(index + 1)]
                })
            })
            .catch((error) => {
                handleError(error);
            })

    }

    render() {
        return (
            <div>
                <NavigationBar/>
                <Header title={'Parameters'}/>
                <ParameterList parameters={this.state.parameter}
                               user={this.props.user}
                               toggleParameter={this.toggleParameter}
                               deleteParameter={this.deleteParameter}/>
            </div>

        );
    }
}

export default Parameters;
