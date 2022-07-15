import React, {Component} from "react";
import Node from './Node/Node';
import './Grid.css';
import {dijistras} from './diji.js';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {bfs} from './bfs.js';
import {dfs} from './dfs.js';
import { AppBar, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Toolbar } from "@mui/material";
import Typography from "@mui/material/Typography";
import InfoIcon from '@mui/icons-material/Info';
import IconButton from "@mui/material/IconButton";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import {grey} from '@mui/material/colors';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export default class Grid extends Component {
    constructor(props) {
        super();
        this.state = {
            nodes: [], 
            mousePressed: false,
            addWeight: false,
            weightNum: 1,
            startRow: 5,
            startCol: 5,
            endRow: 10,
            endCol: 10,
            changeStart: false,
            changeEnd: false,
            changeWall: false,
            algorithm: "dijistra",
            speedMultiplier: 12,
            open: false,
            foundPath: false,
            displayBadge: false,
        };

    }



    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown);
        const nodes = [];
        for (let row = 0; row < 20; row++) {
            const currentRow = [];
            for (let col = 0; col < 50; col++) {
                var distance = Infinity;
                const currentNode = {row, col, isStart : row === this.state.startRow && col === this.state.startCol, isFinish: row === this.state.endRow && col === this.state.endCol, type: false, distance, weight: 1, explored: false, previous: null, display: false, route: false};
                currentRow.push(currentNode);
            }
            nodes.push(currentRow);
        }

        this.setState({nodes})
    }

    clearWalls() {
        const newNodes = this.state.nodes.slice();

        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 50; j++) {
                const newNode = {
                    ...this.state.nodes[i][j],
                    type: false,
                    display: false,
                    distance: Infinity,
                    route: false,
                    explored: false,
                };

                newNodes[i][j] = newNode;
            }
        }

        this.setState({nodes: newNodes});    
    }

    clearWeights() {
        const newNodes = this.state.nodes.slice();

        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 50; j++) {
                const newNode = {
                    ...this.state.nodes[i][j],
                    explored: false,
                    display: false,
                    distance: Infinity,
                    route: false,
                    weight: 1,
                };

                newNodes[i][j] = newNode;
            }
        }

        this.setState({nodes: newNodes});
    }

    clearForDiji() {
        const newNodes = this.state.nodes.slice();

        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 50; j++) {
                const newNode = {
                    ...this.state.nodes[i][j],
                    explored: false,
                    display: false,
                    distance: Infinity,
                    route: false,
                };

                newNodes[i][j] = newNode;
            }
        }

        this.setState({nodes: newNodes});
        this.setState({foundPath: false});
    }

    resetBoard() {
        const newNodes = this.state.nodes.slice();

        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 50; j++) {
                const newNode = {
                    ...this.state.nodes[i][j],
                    explored: false,
                    type: false,
                    display: false,
                    route: false,
                    weight: 1,
                };

                newNodes[i][j] = newNode;
            }
        }

        this.setState({nodes: newNodes});
        this.setState({foundPath: false});
        this.setState({displayBadge: false});
    }

    displayPath(visited) {
        for (let i = 0; i < visited.length; i++) {
            setTimeout(() => {
                const updatedNodes = this.state.nodes.slice();
                updatedNodes[visited[i].row][visited[i].col].display = true; 
                this.setState({nodes: updatedNodes});
            }, 0.5 * this.state.speedMultiplier * (i));
        }

        setTimeout(() => {
            this.displayEndRoute();
        }, 0.5 * this.state.speedMultiplier * visited.length + 500);
    }


    displayEndRoute() {
        if (this.state.nodes[this.state.endRow][this.state.endCol].explored === false) {
            this.setState({foundPath: false});
            this.setState({displayBadge: true});
            return;
        }
        this.setState({displayBadge: true});


        //make it in order
        let routeInOrder = [];
        for (let prev = this.state.nodes[this.state.endRow][this.state.endCol].previous; prev !== null && (prev.row !== this.state.startRow || prev.col !== this.state.startCol); prev = prev.previous) {
            routeInOrder.unshift(prev);
        }

        for (let i = 0; i < routeInOrder.length; i++) {
            setTimeout(() => {
                const updatedNodes = this.state.nodes.slice();
                updatedNodes[routeInOrder[i].row][routeInOrder[i].col].route = true;
                this.setState({nodes: updatedNodes});
            }, 10 * this.state.speedMultiplier * i);
        }
        this.setState({foundPath: true});

    }

    handleKeyDown = (event) => {
        if (event.keyCode === 83) { //start key, then we change start node
            this.setState({changeStart: true});
            this.setState({changeEnd: true});
            this.setState({addWeight: false});
            this.setState({changeWall: false});
        } else if (event.keyCode === 69) { //end key, then we change end node
            this.setState({changeStart: false});
            this.setState({changeEnd: true});
            this.setState({addWeight: false});
            this.setState({changeWall: false});
        } else if (event.keyCode >= 49 && event.keyCode <= 57) { //number keys, then we change weight
            this.setState({addWeight: true});
            this.setState({changeEnd: false});
            this.setState({changeStart: false});
            this.setState({changeWall: false});
            this.setState({weightNum: event.keyCode - 48});
        }
    }

    runPathFinding = () => {
        this.clearForDiji();
        var visited;
        if (this.state.algorithm === 'dijistra') { //maybe have to change
            visited = dijistras(this.state.nodes, this.state.startRow, this.state.startCol, this.state.endRow, this.state.endCol);
        } else if (this.state.algorithm === 'DFS') {
            visited = dfs(this.state.nodes, this.state.startRow, this.state.startCol, this.state.endRow, this.state.endCol);
        } else {
            visited = bfs(this.state.nodes, this.state.startRow, this.state.startCol, this.state.endRow, this.state.endCol);
        }
        this.displayPath(visited);

        
    }


    onMouseDown(row, col) {
        if (this.state.changeStart === false && this.state.changeEnd === false && this.state.addWeight === false) { //if we are adding walls
            this.setState({mousePressed: true});
            const nodes = updateWall(this.state.nodes, row, col);
            this.setState({nodes: nodes});
        } else if (this.state.addWeight === true) { //if we are adding weighted nodes
            console.log("made it here");
            this.setState({mousePressed: true});
            const nodes = updateWeight(this.state.nodes, row, col, this.state.weightNum);
            this.setState({nodes: nodes});

        } else { //change the node to start/finish
            if (this.state.changeStart === true) {
                if (this.state.nodes[row][col].isEnd === true) {
                    this.setState({changeStart: false});
                    return;
                }
                const changeStartNode = this.state.nodes.slice();
                changeStartNode[this.state.startRow][this.state.startCol].isStart = false;
                changeStartNode[row][col].isStart = true;
                this.setState({changeStart: false});
                this.setState({nodes:changeStartNode});
                this.setState({startRow: row});
                this.setState({startCol: col});
            } else { //change start/end
                if (this.state.nodes[row][col].isStart === true) {
                    this.setState({changeEnd: false});
                    return;
                }

                const changeEndNode = this.state.nodes.slice();
                changeEndNode[this.state.endRow][this.state.endCol].isFinish = false;
                changeEndNode[row][col].isFinish = true;
                this.setState({changeEnd: false});
                this.setState({nodes:changeEndNode});
                this.setState({endRow: row});
                this.setState({endCol: col});
            }
        }
    }

    onMouseEnter(row, col) {
        if (this.state.mousePressed === true) {
            if (this.state.addWeight === true) {
                console.log("weight changed");
                const nodes = updateWeight(this.state.nodes, row, col, this.state.weightNum);
                this.setState({nodes: nodes});
            }
            else {
                const nodes = updateWall(this.state.nodes, row, col);
                this.setState({nodes: nodes});
            }
        }

    }

    onMouseUp() {
        this.setState({mousePressed : false});
        this.setState({changeWall: false});
        this.setState({addWeight: false});
        this.setState({changeStart: false});
        this.setState({changeEnd: false});
        this.setState({weightNum: 1});

    }

    handleSelect = (event) => {
        this.setState({algorithm : event.target.value});
    }

    changeSpeed = (event) => {
        this.setState({speedMultiplier: parseInt(event.target.value)});
    }

    openInfo() {
        this.setState({open: true});
    }
    
    closeInfo() {
        this.setState({open: false});
        console.log("I am being called");
    }


    render() {
        const {nodes} = this.state;
        //<InputLabel id="algorithm-selector" sx = {{color: "white"}}>Algorithm</InputLabel>
        return (
            <div>
                <AppBar>
                <Toolbar color="inherit" className = "menu">
                <Typography variant="h6" color="inherit" component="div">
                    PathFinding Visualiser
                </Typography>
                <div className = "divider"></div>
                <FormControl className = "select" variant = "filled" sx={{ m: 1, minWidth: 100, backgroundColor: grey[700]}} size = "small">
                    <InputLabel id="algorithm-selector" sx = {{color: "white"}}>Algorithm</InputLabel>
                    <Select labelId = "algorithm-selector" id = "a-select" value = {this.state.algorithm} onChange = {this.handleSelect} label = "Algorithm"
                        sx = {{color: "white", backgroundColor: grey[700]}}
                    >
                        <MenuItem value = {"dijistra"} color="inherit">Dijistra</MenuItem>
                        <MenuItem value = {"BFS"}>BFS</MenuItem>
                        <MenuItem value = {"DFS"}>DFS</MenuItem>
                    </Select>
                </FormControl>
                <div className = "divider"></div>
                <Button className = "button" size = "medium" variant = "contained" color = "error" onClick = {() => this.resetBoard()}>
                    Reset
                </Button>
                <div className = "divider"></div>
                <Button className = "button" size = "medium" variant = "contained" color = "error" onClick = {() => this.clearWalls()}>Clear Walls</Button>
                <div className = "divider"></div>
                <Button className = "button" size = "medium" variant = "contained" color = "error" onClick = {() => this.clearWeights()}>Clear Weights</Button>
                <div className = "divider"></div>
                <Button className = "button" size = "medium" variant = "contained" color = "success" onClick = {() => this.runPathFinding()}>
                    Run Pathfinding
                </Button>
                <div className = "divider"></div>
                <ButtonGroup variant="contained" aria-label="outlined primary button group" size = "large">
                    <Button value = {12} onClick = {(event) => this.changeSpeed(event, "value")}>1x</Button>
                    <Button value = {6} onClick = {(event) => this.changeSpeed(event, "value")}>2x</Button>
                    <Button value = {4} onClick = {(event) => this.changeSpeed(event, "value")}>3x</Button>
                    <Button value = {3} onClick = {(event) => this.changeSpeed(event, "value")}>4x</Button>
                </ButtonGroup>
                <div className = "big-divider"></div>
                <Controls/>
                </Toolbar>
                </AppBar>
            <div className = "grid">
                {
                    nodes.map((row, rowIdx) => {
                        return (
                            row.map((node, nodeIdx) => {
                    
                                const {isStart} = node;
                                const {isFinish} = node;
                                const {row} = node;
                                const {col} = node;
                                const {type} = node;
                                const {display} = node;
                                const {route} = node;
                                const {weight} = node;
                                return (
                                <Node isStart = {isStart} isFinish = {isFinish} key = {nodeIdx} row = {row} col = {col} type = {type} onMouseDown = {(row, col) => this.onMouseDown(row, col)}
                                onMouseEnter = {(row, col) => this.onMouseEnter(row, col)} onMouseUp = {() => this.onMouseUp()} display = {display} route = {route} weight = {weight}
                                ></Node>
                                );
                            })
                        )
                    })
                }


            </div>
            <div className = "vertical-divider"></div>
            <FoundPath end = {this.state.foundPath} display = {this.state.displayBadge}/>
            </div>
        );
    }
}

const updateWall = (arr, row, col) => {

    const newNodes = arr;
    const node = newNodes[row][col];
    const newNode = {
        ...node,
        type: !node.type,
        weight: 1
    };
    newNodes[row][col] = newNode;

    return newNodes;

};

const updateWeight = (arr, row, col, newWeight) => {
    const newNodes = arr;
    const oldNode = newNodes[row][col];
    const newNode = {
        ...oldNode,
        weight: newWeight,
        type: false


    };
    newNodes[row][col] = newNode;

    return newNodes;
};

function Controls() {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <div>
        <IconButton onClick = {handleClickOpen}>
            <InfoIcon sx = {{color: "white"}}/>
        </IconButton>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Controls"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
                Set Start Position: Press S and click on desired position <br/>
                Set End Position: Press E and click on desired position <br/>
                Add walls: Click and drag <br/>
                Add weighted nodes: Press 1-9 to select weight and click and drag
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
}

function FoundPath(props) {
    const {
        end,
        display
    } = props;
    if (display === false) {
        return (<></>);
    }

    if (end === true) {
        return (
            <Alert severity="success">Algorithm has successfully found a path!</Alert>
        );
    } else {
        return (
            <Alert severity="error">Algorithm failed to find a path!</Alert>
        );
    }
}