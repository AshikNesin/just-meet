import { $click } from './../helpers/dom'
import optionsStorage from '../options-storage';


export const autoTurnOffCamOnJoin = async () => {
    const options = await optionsStorage.getAll()

    const camBtnEl = [...document.querySelectorAll('[role="button"]')][1]

    if (options.autoTurnOffCamOnJoin) {
        camBtnEl.click()
    }
}

export default autoTurnOffCamOnJoin
