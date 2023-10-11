/**
 * Create miner popup
 */

import React from 'react'

class CreateMiner extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			carryCapacity: 0,
			travelSpeed: 0,
			miningSpeed: 0,
			totalPoints: 0,
			limit: 120
		}
		this.updatePoints = this.updatePoints.bind(this)
		this.computePoints = this.computePoints.bind(this)
	}

	computePoints() {
		this.setState({
			totalPoints: this.state.carryCapacity + this.state.travelSpeed + this.state.miningSpeed
		})
	}

	updatePoints(key, value) {
		value = parseInt(value)
		if(value < 1)
			value = 0

		this.setState({
			[key]: value
		}, () => this.computePoints())
	}

	render() {
		return <form action="http://localhost:3000/miners" method="POST">
			<div className="field error">
				<label htmlFor="name">Miner name</label>
				<input type="text" id="name" name="name" placeholder="Miner name" />
				<div className="message">This name is already taken</div>
			</div>

			<div className="field">
				<label htmlFor="planet">Planet</label>
				<select placeholder="Select a planet" id="planet" name="planet">
					<option>Planet 1</option>
					<option>Planet 2</option>
					<option>Planet 3</option>
				</select>
			</div>

			<h2>Assign points</h2>

			<div className="columns">
				<div className="column">
					<div className="field">
						<label htmlFor="carry-capacity">Carry capacity</label>
						<input value={this.state.carryCapacity} type="number" id="carry-capacity" name="carryCapacity" placeholder="0" onChange={(e) => this.updatePoints('carryCapacity', e.target.value)} />
					</div>
				</div>
				<div className="column">
					<div className="field">
						<label htmlFor="travel-speed">Travel speed</label>
						<input value={this.state.travelSpeed} type="number" id="travel-speed" name="travelSpeed" placeholder="0" onChange={(e) => this.updatePoints('travelSpeed', e.target.value)} />
					</div>
				</div>
				<div className="column">
					<div className="field">
						<label htmlFor="mining-speed">Mining speed</label>
						<input value={this.state.miningSpeed} type="number" id="mining-speed" name="miningSpeed" placeholder="0" onChange={(e) => this.updatePoints('miningSpeed', e.target.value)} />
					</div>
				</div>
			</div>

			<div className={this.state.totalPoints <= this.state.limit ? 'green' : 'red'}>{this.state.totalPoints}/{this.state.limit}</div>
			<div className="actions">
				<button>Save</button>
			</div>
		</form>
	}
}

export default CreateMiner