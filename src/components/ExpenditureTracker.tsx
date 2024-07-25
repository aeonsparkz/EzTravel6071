import { useState, useEffect } from "react";
import "./styles/ExpenditureTracker.css";
import Modal from "./Modal";
import supabase from "../supabaseClient";

interface ExpenditureTrackerProps {
    isOpen: boolean;
    onClose: () => void;
    itineraryid: string;
}

function ExpenditureTracker({ isOpen, onClose, itineraryid }: ExpenditureTrackerProps) {
    const [userId, setUserId] = useState<string | null>(null);
    const [task, setTask] = useState("");
    const [totalExpense, setTotalExpense] = useState(0);
    const [cost, setCost] = useState('');
    const [date, setDate] = useState("");

    type taskExpenseProps = {
        activity_id: string;
        date: string;
        expense: number;
        task: string;
    }

    const [taskExpense, setTaskExpense] = useState<taskExpenseProps[]>([]);

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (data?.user) {
                setUserId(data.user.id);
            } else {
                console.error('User not logged in');
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        const { data, error } = await supabase
            .from('Expenditure')
            .select('*')
            .eq('itinerary_id', itineraryid);

        if (error) {
            console.error('Error fetching data:', error);
            return;
        }

        if (data) {
            console.log('Fetched data:', data);
            setTaskExpense(data);
            const total = data.reduce((acc, item) => acc + item.expense, 0);
            setTotalExpense(total);
        }
    };

    const deleteActivity = async (activityId: string) => {
        const { data, error } = await supabase
            .from('Expenditure')
            .delete()
            .eq('activity_id', activityId);

        if (error) {
            console.error('Error deleting activity:', error);
            return;
        }

        console.log('Activity deleted successfully:', data);
    };

    const sumExpense = async () => {
        const additionalCost = parseInt(cost, 10);
        if (!isNaN(additionalCost)) {
            const { data, error } = await supabase
                .from('Expenditure')
                .insert([{ itinerary_id: itineraryid, user_id: userId, date: date, task: task, expense: additionalCost }])
                .select();

            if (error) {
                console.error('Error inserting activity:', error);
                return;
            }

            if (data && data.length > 0) {
                const newActivity = data[0];
                console.log('New activity inserted:', newActivity);

                setTaskExpense(taskExpense => [
                    ...taskExpense,
                    { activity_id: newActivity.activity_id, date: newActivity.date, expense: newActivity.expense, task: newActivity.task }
                ]);
                setTotalExpense(totalExpense => totalExpense + additionalCost);
                setTask('');
                setCost('');
                console.log('Task expense updated:', taskExpense);
            } else {
                console.error('No data returned after insertion.');
            }
        }

    };

    const removeExpense = async (index: number) => {
        const activityToBeDeleted = taskExpense[index];
        const newTaskExpense = taskExpense.filter((_, i) => i !== index);
        setTaskExpense(newTaskExpense);
        setTotalExpense(newTaskExpense.reduce((total, current) => total + current.expense, 0));
        await deleteActivity(activityToBeDeleted.activity_id);
    };

    if (!isOpen) {
        return null;
    }

    const groupedByDate = taskExpense.reduce((acc, item) => {
        (acc[item.date] = acc[item.date] || []).push(item);
        return acc;
    }, {} as Record<string, taskExpenseProps[]>);

    return (
        <Modal isOpen={isOpen} onClose={onClose} >
            <div className="header">
                <h2>Expenditure Tracker</h2>
            </div>
            <div className="tracker">
                <div className="inputquestions">
                    <label htmlFor="date-input">Date</label>
                    <input id="date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    <input className="tracker_input-box"
                        type="text"
                        value={task}
                        onChange={(input) => setTask(input.target.value)}
                        placeholder="Enter Task"
                        required>
                    </input>
                    <input className="tracker_input-box"
                        type="number"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        placeholder="Enter cost"
                        required
                    >
                    </input>
                    <button onClick={sumExpense}
                        style={{ margin: '5px', padding: '5px', backgroundColor: 'blue', color: 'white', borderRadius: '4px' }}>Add Expense</button>
                </div>
                <div className="results">
                    {Object.entries(groupedByDate).map(([date, items]) => (
                        <div key={date} className="date-group">
                            <div className="date-column">{date}</div>
                            <div className="tasks-column">
                                {items.map((item, index) => (
                                    <div className="results-item" key={item.activity_id}>
                                        <p>Activity: {item.task}</p>
                                        <p>Cost: {item.expense}</p>
                                        <button
                                            onClick={() => removeExpense(index)}
                                            style={{ margin: '5px', padding: '5px', backgroundColor: 'blue', color: 'white', borderRadius: '4px' }}>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="totalexpense">
                    <p>Total Expense: {totalExpense}</p>
                </div>
            </div>
            <button type="button" style={{ margin: '5px', padding: '5px', backgroundColor: 'blue', color: 'white', borderRadius: '4px' }} onClick={onClose}>Cancel</button>
        </Modal>
    )
}

export default ExpenditureTracker;
