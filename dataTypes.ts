// -----main types-----
export type User = {
  _id: string; //primary key
  name: string;
  phone: number;
  email: string;
  address: {
    name: string;
    zipcode: number;
    state: string;
    private: boolean;
    coordinates: {
      lat: number;
      long: number;
    };
  };
  friends: string[];
};

export type Group = {
  _id: string; //primary key
  ownerId: string; //foreign key
  name: string;
  description: string;
  members: string[]; //array of userIds
};

export type Event = {
  _id: string; //primary key
  ownerId: string; //foreign key
  groupId: string; //foreign key

  description: string;
  location: Location;
  time: string; // datetime string

  suggestions: Location[];
  messages: Message[];
};

//------ sub-types------
export type Location = {
  name: string;
  url: string;
  address: {
    street: string;
    zipcode: number;
    coordinates: {
      lat: number;
      long: number;
    };
  };
  votes: Vote[];
};

export type Message = {
  messageId: string;
  userId: User;
  name: string;
  email: string;
  message: string;
  created: string; // datetime string
  updated: string | null; // datetime string
};

export type Vote = {
  count: number;
  userId: string;
};
