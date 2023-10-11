/**
 * List of asteroids
 */

import React from 'react'

class AsteroidList extends React.Component {
    constructor(props) {
        super(props)
		this.state = {
			loading: false
		}
        this.ListData = this.ListData.bind(this);
    }

    async componentDidMount() {
		fetch("http://localhost:3000/asteroids")
			.then(data => data.json())
			.then(
				result => {
					this.setState({
						asteroids: result,
						loading: true
					});
					//console.log("retrieving asteroids" + JSON.stringify(this.state.asteroids));
				},
				error => {
					this.setState({
						asteroids: "error"
					});
					//console.log("see some problem")
					return null;
				}
			);
		fetch("http://localhost:3000/miners")
			.then(data => data.json())
			.then(
				result => {
					this.setState({
						miners: result
					});
					console.debug(this.state.miners);
				},
				error => {
					this.setState({
						miners: "error"
					});
					return null;
				}
			);
	}

	ListData = () => {
		let dataStr = JSON.stringify(this.state.asteroids);
		//console.log(dataStr);

		let asteroidList = JSON.parse(dataStr);
		//console.log(JSON.parse(dataStr));

		let row = "";
		asteroidList.map(asteroid => {
			let asteroidPos = asteroid.position;
			let asteroidMiner = "";
			if (Boolean(this.state.miners)) {
				JSON.parse(JSON.stringify(this.state.miners)).map(miner => {
					let minerPosition = miner.position;
					if (Boolean(asteroidPos) &&
						Boolean(minerPosition) &&
						miner.position.x === asteroidPos.x &&
						miner.position.y === asteroidPos.y) {
						asteroidMiner = miner.name;
						// console.log("planet miner name:" + miner.name);
					}
				})
			}

			row += `<tr>`;
			row += `<td>${asteroid.name}</td>`;
			row += `<td>${asteroid.minerals}</td>`;
			row += `<td>${asteroidMiner}</td>`;
			row += `<td>${asteroid.position.x}, ${asteroid.position.y}</td>`;
			row += `</tr>`;
		})
		return document.getElementById("asteroidTbl").innerHTML = row;
	}

	render() {
		return <div className="list">
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Minerals</th>
						<th>Current miner</th>
						<th>Position (x, y)</th>
					</tr>
				</thead>

                <tbody id="asteroidTbl">
                <tr>
                    <td>Asteroid 1</td>
                    <td>758/963</td>
                    <td>Miner 1</td>
                    <td>832, 635</td>
                </tr>
				<tr>
						<td>Asteroid 2</td>
						<td className="red">0/879</td>
						<td>-</td>
						<td>759, 118</td>
					</tr>

					<tr>
						<td>Asteroid 3</td>
						<td>915/1157</td>
						<td>Miner 2</td>
						<td>216, 492</td>
					</tr>

					<tr>
						<td>Asteroid 4</td>
						<td>2/989</td>
						<td>Miner 4</td>
						<td>564, 349</td>
					</tr>

					<tr>
						<td>Asteroid 5</td>
						<td>702/905</td>
						<td>-</td>
						<td>255, 255</td>
					</tr>
				{
					this.state.loading ? this.ListData():""
				}
				</tbody>
			</table>
		</div>
	}
}

export default AsteroidList