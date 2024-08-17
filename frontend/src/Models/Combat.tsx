export interface Leftclicker {
    leftclickerEnabled: boolean,
    leftJitter: number,
    leftclickerBind: number,
    blockhitChance: number,
    shiftDisable: boolean,
    lockLeft: boolean,
    clickInMenu: boolean,
    breakBlocks: boolean,
    onlyClickIngame: boolean,
    leftclickerCps: number
}

export interface Rightclicker {
    rightclickerEnabled: boolean,
    rightJitter: number,
    rightclickerCps: number,
    rightclickerBind: number
    allowEat: boolean
}

export interface Reach {
    reachOnlySprinting: boolean
    reachEnabled: boolean,
    reachRange: number,
    reachChance: number,
    reachBind: number,
}

export interface Refill {
    refillEnabled: boolean,
    refillDelay: number,
    fullscreenRefill: boolean,
    randomizePosition: boolean,
    selectColor: boolean,
    selectPosition: boolean,
    refillBind: number,
    refillColor: string,
}

export interface Throwpot {
    throwpotEnabled: boolean,
    throwpotBind: number,
    throwpotStart: number,
    throwpotEnd: number,
    throwpotReturn: number,
    throwpotDelay: number,
}

export interface Esp {
    playerEspEnabled: boolean,
    playerEspCircle: boolean,
    playerChams: boolean,
    espBind: number,
    chamsBind: number,
    espColor: string,
    espCircleColor: string,
}

export interface Nametags {
    nametagsExtender: boolean,
    nametagsBox: boolean,
    nametagsChams: boolean,
    nametagsExtenderBind: number,
    nametagsBoxBind: number,
    nametagsChamsBind: number
}

export interface Destruct {
    filename: string,
}

export interface Aim {
    aimEnabled: boolean,
    aimFov: number,
    aimDistance: number,
    aimSmooth: number,
    aimCircleEnabled: boolean,
    aimAssistCircleColor: string,
    aimAssistYaw: number,
    aimAssistPitch: number
    aimAssistBind: number,
}

export interface Esp2D {
    esp2dEnabled: boolean,
    esp2dColor: string,
    esp2dHealth: boolean,
    esp2dBind: number,
}

export interface Tracers {
    tracersEnabled: boolean,
    tracersColor: string
}