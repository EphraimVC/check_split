import { useState } from "react";

const initialFriends = [
    {
        id: 118836,
        name: "Clark",
        image: "https://i.pravatar.cc/48?u=118836",
        balance: -7,
    },
    {
        id: 933372,
        name: "Sarah",
        image: "https://i.pravatar.cc/48?u=933372",
        balance: 20,
    },
    {
        id: 499476,
        name: "Anthony",
        image: "https://i.pravatar.cc/48?u=499476",
        balance: 0,
    },
];

export default function App() {
    const [friendsList, setFriendsList] = useState(initialFriends);
    const [showForm, setShowForm] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    function handleSelection(friend) {
        setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
        setShowForm(false);
        console.log(selectedFriend);
    }

    function handleSplitBill(value) {
        setFriendsList((friend) =>
            friend.map((friends) =>
                friends.id === selectedFriend.id
                    ? { ...friends, balance: friends.balance + value }
                    : friends
            )
        );
        setSelectedFriend(null);
    }

    const toggle = () => {
        setShowForm((s) => !s);
    };

    const handleAddFriend = (friend) => {
        setFriendsList((friends) => [...friends, friend]);
        setShowForm(false);
    };
    return (
        <div className="app">
            <div className="sidebar">
                <FriendList
                    list={friendsList}
                    onSelected={handleSelection}
                    friendSelection={selectedFriend}
                />
                {showForm && <FormAddFriend onAddFriend={handleAddFriend} />}
                <Btn onClick={toggle}>{showForm ? "Close" : "Add Friend"}</Btn>
            </div>
            {selectedFriend && (
                <FormSplitBill
                    selectedFriend={selectedFriend}
                    onSplitBill={handleSplitBill}
                />
            )}
        </div>
    );
}

function Btn({ children, onClick }) {
    return (
        <button className="button" onClick={onClick}>
            {children}
        </button>
    );
}

function FriendList({ list, onSelected, friendSelection }) {
    return (
        <ul>
            {list.map((friend) => (
                <Friend
                    friend={friend}
                    key={friend.id}
                    onSelected={onSelected}
                    friendSelection={friendSelection}
                />
            ))}
        </ul>
    );
}

function Friend({ friend, onSelected, friendSelection }) {
    const isSelected = friendSelection?.id === friend.id; // optional chaining ("?") in this case friendSelection is null before it have been called, the ? helps to make the optional

    return (
        <li className={isSelected ? "selected" : " "}>
            <img src={friend.image} alt={friend.name} />
            <h3>{friend.name}</h3>
            {friend.balance < 0 && (
                <p className="red">
                    You owe {friend.name} {Math.abs(friend.balance)} €
                </p>
            )}
            {friend.balance > 0 && (
                <p className="green">
                    {friend.name} owes you {Math.abs(friend.balance)} €
                </p>
            )}
            {friend.balance === 0 && (
                <p className="">You and {friend.name} are even.</p>
            )}
            <Btn onClick={() => onSelected(friend)}>
                {isSelected ? "Close" : "Select"}
            </Btn>
        </li>
    );
}

function FormAddFriend({ onAddFriend }) {
    const [name, setName] = useState("");
    const [image, setimage] = useState("https://i.pravatar.cc/48?u=");

    const handleNewFriend = (e) => {
        e.preventDefault();

        const newId = crypto.randomUUID();
        const newFriend = {
            name,
            image: `${image}${newId}`,
            balance: 0,
            id: newId,
        };

        onAddFriend(newFriend);
        setName("");
    };
    return (
        <form className="form-add-friend" onSubmit={handleNewFriend}>
            <label>😃 Friend Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <label>🌄 Image URL</label>
            <input
                type="text"
                value={image}
                onChange={(e) => setimage(e.target.value)}
            />
            <Btn>Add</Btn>
        </form>
    );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
    const [bill, setBill] = useState("");
    const [paidByUser, setPaidByUser] = useState("");
    const friendBillPart = bill ? bill - paidByUser : " ";
    const [billPayer, setBillPayer] = useState("user");

    function handleBillSubmit(e) {
        e.preventDefault();
        if (!bill || !paidByUser) return;
        onSplitBill(billPayer === "user" ? friendBillPart : -paidByUser);
    }

    return (
        <form className="form-split-bill" onClick={handleBillSubmit}>
            <h2>Split a bill with {selectedFriend.name}</h2>
            <label>💳 Bill value</label>
            <input
                type="text"
                value={bill}
                onChange={(e) => setBill(Number(e.target.value))}
            />
            <label> 💵Your expense</label>
            <input
                type="text"
                value={paidByUser}
                onChange={(e) =>
                    setPaidByUser(
                        Number(e.target.value) > bill
                            ? paidByUser
                            : Number(e.target.value) //this ternary operation does that the user can input a value higher than the bill value
                    )
                }
            />
            <label>😁 {selectedFriend.name}´s expense</label>
            <input type="text" disabled value={friendBillPart} />
            <label>🧾 Who is paying the bill ?</label>
            <select
                value={billPayer}
                onChange={(e) => setBillPayer(e.target.value)}
            >
                <option value="user">You</option>
                <option value="friend">{selectedFriend.name}</option>
            </select>
            <Btn>Split bill</Btn>
        </form>
    );
}
