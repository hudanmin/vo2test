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
                <tr className="hidden">
                    <td>Asteroid 1</td>
                    <td>758/963</td>
                    <td>Miner 1</td>
                    <td>832, 635</td>
                </tr>
				<tr className="hidden">
						<td>Asteroid 2</td>
						<td className="red">0/879</td>
						<td>-</td>
						<td>759, 118</td>
				</tr>

				<tr className="hidden">
						<td>Asteroid 3</td>
						<td>915/1157</td>
						<td>Miner 2</td>
						<td>216, 492</td>
				</tr>

				<tr className="hidden">
						<td>Asteroid 4</td>
						<td>2/989</td>
						<td>Miner 4</td>
						<td>564, 349</td>
				</tr>

				<tr className="hidden">
						<td>Asteroid 5</td>
						<td>702/905</td>
						<td>-</td>
						<td>255, 255</td>
				</tr>
				{
					this.state.loading ? JSON.parse(JSON.stringify(this.state.asteroids)).map((asteroid, idx) => {
						let asteroidPos = asteroid.position;
						let asteroidMiner = "-";
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
						//TODO: need to calculate the remaining mineral per asteroid miner's mining activity
						let remainingMinerals = (asteroidMiner === "-")?asteroid.minerals:"";
						return <tr id={asteroid.id} key={idx}>
							    <td>{asteroid.name}</td>
							    <td>{remainingMinerals}/{asteroid.minerals}</td>
							    <td>{asteroidMiner}</td>
							    <td>{asteroid.position.x}, {asteroid.position.y}</td>
						       </tr>
					}) : ""
				}
				</tbody>
			</table>
		</div>
	}
}

export default AsteroidList