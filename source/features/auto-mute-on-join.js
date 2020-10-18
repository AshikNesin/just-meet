import {$click} from './../helpers/dom'
import optionsStorage from './../options-storage';

export const autoMuteOnJoin = async () => {
    const options = await optionsStorage.getAll()
    const [micBtnEl] = [...document.querySelectorAll('[role="button"]')]
    if (options.autoMuteOnJoin) {
        micBtnEl.click()
    }
}

export default autoMuteOnJoin
