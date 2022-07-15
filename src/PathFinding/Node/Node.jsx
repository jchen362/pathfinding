import React, {Component} from "react";
import './Node.css';
import StarIcon from '@mui/icons-material/Star';
import FlagIcon from '@mui/icons-material/Flag';
import { pink } from '@mui/material/colors';


export default class Node extends Component {
    render() {
        const {
            isFinish,
            isStart,
            row,
            col,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
            type,
            display,
            route,
            weight,
        } = this.props

        const extraName =
            isFinish ? 'nodeFinish'
            : isStart ? 'nodeStart'
            : type ? 'nodeBlock'
            : route ? 'nodeRoute'
            : display ? 'nodeExplored'
            : '';

        var special = "";
        if (isStart === true) {
            special = <StarIcon className = "special-icon" color = "success"/>
        } else if (isFinish === true) {
            special = <FlagIcon className = "special-icon" sx={{ color: pink[600] }}/>
        } else if (weight > 1) {
            special = weight;
        }

        let specialName = "weight";
        if (isStart === true || isFinish === true) {
            specialName = "special-icon";
        }


        return (
            <div className = {`node ${extraName}`}
            onMouseDown = {() => onMouseDown(row, col)}
            onMouseEnter = {() => onMouseEnter(row, col)}
            onMouseUp = {() => onMouseUp()}
            >
                <div className = {specialName}>
                    {special}
                </div>
            </div>
        );
        
    }
}

