/**
 * List of miners
 */

import React from 'react'
import Rodal from 'rodal'
import PopupContent from './popup.jsx'
import Loader from '../layout/loader.jsx'

class MinerList extends React.Component {
	constructor(props) {
		super(props)
		const minerStatus = new Map([
			[0, "Idle"],
			[1, "Traveling"],
			[2, "Mining"],
			[3, "Transferring minerals to planet"]
		])
		this.state = {
			popupVisible: false,
			loading: true,
			minerStatus: minerStatus
		}
	}
	componentDidMount() {
		fetch("http://localhost:3000/miners")
			.then(data => data.json())
			.then(
				result => {
					this.setState({
						miners: result
					});
					//console.log(this.state.miners);
				},
				error => {
					this.setState({
						miners: "error"
					});
					return null;
				}
			);
		fetch("http://localhost:3000/planets")
			.then(data => data.json())
			.then(
				result => {
					this.setState({
						planet: result
					});
					//console.log(this.state.result);
				},
				error => {
					this.setState({
						planet: "error"
					});
					return null;
				}
			);
	}

	openPopup() {
		// If there is a timeout in progress, cancel it
		if(this.state.loaderTimeout)
			clearTimeout(this.state.loaderTimeout)

		this.setState({
			popupVisible: true,
			loading: true,
			loaderTimeout: setTimeout(() => {
				this.setState({
					loading: false
				})
			}, 2000)
		})
	}

	hidePopup() {
		this.setState({
			popupVisible: false
		})
	}
	render() {
		return <div className="list">
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Planet</th>
						<th>Carry capacity</th>
						<th>Travel speed</th>
						<th>Mining speed</th>
						<th>Position (x, y)</th>
						<th>Status</th>
					</tr>
				</thead>

				<tbody id="minerTbl">
					<tr className="hidden" onClick={this.openPopup.bind(this)}>
						<td>Miner 1</td>
						<td>Planet 1</td>
						<td>113/120</td>
						<td>60</td>
						<td>20</td>
						<td>832, 635</td>
						<td>Mining</td>
					</tr>

					<tr className="hidden" onClick={this.openPopup.bind(this)}>
						<td>Miner 2</td>
						<td>Planet 2</td>
						<td className="green">120/120</td>
						<td>60</td>
						<td>20</td>
						<td>832, 635</td>
						<td>Traveling</td>
					</tr>

					<tr className="hidden" onClick={this.openPopup.bind(this)}>
						<td>Miner 3</td>
						<td>Planet 3</td>
						<td>113/120</td>
						<td>50</td>
						<td>20</td>
						<td>165, 820</td>
						<td>Transfering</td>
					</tr>

					<tr className="hidden" onClick={this.openPopup.bind(this)}>
						<td>Miner 4</td>
						<td>Planet 1</td>
						<td>0/70</td>
						<td>60</td>
						<td>40</td>
						<td>999, 111</td>
						<td>Traveling</td>
					</tr>

					<tr className="hidden" onClick={this.openPopup.bind(this)}>
						<td>Miner 5</td>
						<td>Planet 2</td>
						<td>113/120</td>
						<td>60</td>
						<td>20</td>
						<td>615, 132</td>
						<td>Traveling</td>
					</tr>

					<tr className="hidden" onClick={this.openPopup.bind(this)}>
						<td>Miner 6</td>
						<td>Planet 3</td>
						<td>113/120</td>
						<td>70</td>
						<td>40</td>
						<td>248, 265</td>
						<td>Transfering</td>
					</tr>

					<tr className="hidden" onClick={this.openPopup.bind(this)}>
						<td>Miner 7</td>
						<td>Planet 1</td>
						<td>113/120</td>
						<td>60</td>
						<td>20</td>
						<td>832, 635</td>
						<td>Traveling</td>
					</tr>

					<tr className="hidden" onClick={this.openPopup.bind(this)}>
						<td>Miner 8</td>
						<td>Planet 2</td>
						<td>113/120</td>
						<td>40</td>
						<td>50</td>
						<td>654, 456</td>
						<td>Traveling</td>
					</tr>

					<tr className="hidden" onClick={this.openPopup.bind(this)}>
						<td>Miner 9</td>
						<td>Planet 3</td>
						<td>113/120</td>
						<td>70</td>
						<td>30</td>
						<td>379, 973</td>
						<td>Traveling</td>
					</tr>
					{
						Boolean(this.state.miners) ? JSON.parse(JSON.stringify(this.state.miners)).map( (miner,idx)=>{
							let MinerStatusStr = this.state.minerStatus.get(miner.status);
							let planetName = "";
							if (Boolean(this.state.planet)) {
								JSON.parse(JSON.stringify(this.state.planet)).map(planet => {
									if (miner.planetId === planet.id) {
										planetName = planet.name;
										// console.log("planet miner name:" + miner.name);
									}
								})
							}
							return  <tr onClick={this.openPopup.bind(this)} id={miner.id} key={idx}>
								<td>{miner.name}</td>
								<td>{planetName}</td>
								<td>/{miner.carryCapacity}</td>
								<td>{miner.travelSpeed}</td>
								<td>{miner.miningSpeed}</td>
								<td>{Boolean(miner.position) ? miner.position.x + ", " + miner.position.y : ""}</td>
								<td>{MinerStatusStr}</td>
							</tr>
						}):""
					}
				</tbody>
			</table>

			<Rodal visible={this.state.popupVisible} onClose={this.hidePopup.bind(this)} width="782" height="480">
				<h2>History of Miner 1</h2>
				{
					this.state.loading ? <Loader /> : <PopupContent />
				}
			</Rodal>
		</div>
	}
}

export default MinerList