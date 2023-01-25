class osc {
	constructor(type, frequency) {
		this.vol = ctx.createGain();
		let defaultVolume = 0.1
		this.vol.gain.setTargetAtTime(defaultVolume, ctx.currentTime, 0);
		$("#volumeSlider").val(defaultVolume)
		//this.vol.connect(analyser); NOW DONE IN MAIN.JS

		this.gain = ctx.createGain();
		this.gain.gain.setTargetAtTime(1, ctx.currentTime, 0);
		this.gain.connect(this.vol);

		this.osc = ctx.createOscillator();
		this.osc.connect(this.gain);
		this.osc.type = type;
		this.osc.frequency.setTargetAtTime(frequency, ctx.currentTime, 0);
		this.osc.start();
	}

	setVolume(volume, speed) {
		this.vol.gain.setTargetAtTime(volume, ctx.currentTime, speed);
	}

	setFrequency(frequency, speed) {
		this.osc.frequency.setTargetAtTime(frequency, ctx.currentTime, speed);
	}
}
