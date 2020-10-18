import autoMuteOnJoin from './features/auto-mute-on-join'
import autoTurnOffCamOnJoin from './features/auto-turn-off-cam-on-join';
import autoJoinCall from './features/auto-join-call'
const readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        autoMuteOnJoin()
        autoTurnOffCamOnJoin()
        autoJoinCall()

    }
}, 10);
