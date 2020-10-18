import optionsStorage from './../options-storage';
import delay from 'delay';



export const autoJoinCall = async () => {
    const options = await optionsStorage.getAll()
    if (options.autoJoinCall) {
        const joinNowBtnCheckInterval = setInterval(async function () {
            const allBtnElements = [...document.querySelectorAll('[role="button"]')];
            if (allBtnElements.length > 4 && allBtnElements[4].textContent === 'Join now') { 
                const joinNowBtn = allBtnElements[4];
                await delay(1000);
                joinNowBtn.click()
                clearInterval(joinNowBtnCheckInterval);
            } 
        }, 10);
    }
}

export default autoJoinCall
