import User from "./User";

export type StateType = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  phoneNumber: string;
  country: string;
}[];

type ActionType =
  | { type: "set"; payload: StateType }
  | { type: "add"; payload: StateType[0] }
  | { type: "edit"; payload: { id: number; updates: Partial<StateType[0]> } }
  | { type: "delete"; payload: { id: number } };

export const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case "set":
      return action.payload;
    case "add":
      return [...state, action.payload];
    case "edit":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, ...action.payload.updates }
          : item
      );
    case "delete":
      return state.filter((item) => item.id !== action.payload.id);
    default:
      return state;
  }
};

const Reducer = () => {
  return (
    <div>
      <User />
    </div>
  );
};

export default Reducer;
