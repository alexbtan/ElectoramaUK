type PartyInfo = {
    [key: string]: {
      total: number;
      name: string;
    };
};

type SeatInfo = {
    electorate: number;
    turnout: number;
    current: string;
    majority: number;
    region: string;
};

type SeatData = {
    seatInfo: SeatInfo;
    partyInfo: PartyInfo;
};

type SeatDataCollection = {
    [key: string]: SeatData;
};

type PartyInfo = {
    [key: string]: {
      total: number;
      name: string;
    };
};

type SeatInfo = {
    electorate: number;
    turnout: number;
    current: string;
    majority: number;
    region: string;
};

type SeatData = {
    seatInfo: SeatInfo;
    partyInfo: PartyInfo;
};

type SeatDataCollection = {
    [key: string]: SeatData;
};

type EthData = {
    RegNationName: string;
    groups: string;
    con_pc: number;
};

type EthDataCollection = {
    [key: string]: EthData[];
};

type AgeData = {
    rn_name: string;
    nat_name: string;
    age: string;
    con_pc: number;
};

type AgeDataCollection = {
    [key: string]: AgeData[];
};

type ChartData = {
    name: string;
    value: number;
};

type Colours = {
    [key: string]: string;
};