import OptionsSync from 'webext-options-sync';

export default new OptionsSync({
	defaults: {
		autoMuteOnJoin: true,
		autoJoinCall:false,
		autoTurnOffCamOnJoin: true,
		debugMode:false
	},
	migrations: [
		OptionsSync.migrations.removeUnused
	],
	logging: true
});
