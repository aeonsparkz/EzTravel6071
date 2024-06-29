import { useState } from "react";
import "./styles/ExpenditureTracker.css";

function ExpenditureTracker() {
    const [task, setTask] = useState("");
    const [totalExpense, setTotalExpense] = useState(0);
    const [cost, setCost] = useState('');

    type taskExpenseProps = {
        expense: number;
        task: string;
    }

    const [taskExpense, setTaskExpense] = useState<taskExpenseProps[]>([])

    const sumExpense = () => {
        const additionalCost = parseInt(cost, 10)
        if (!isNaN(additionalCost)) {
            setTaskExpense([
                ...taskExpense,
                { expense: additionalCost, task: task }
            ])
            setTotalExpense(additionalCost + totalExpense);
            setTask('')
            setCost('');
        } else {
            alert("Please set a valid amount")
        }
    }

    return (
        <>
            <div className="header">
                <h2>Expenditure Tracker</h2>
            </div>
            <div className="tracker">
                <div className="inputquestions">
                    <input className="tracker_input-box"
                        type="number"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        placeholder="Enter cost"
                    >
                    </input>
                    <input className="tracker_input-box"
                        type="text"
                        value={task}
                        onChange={(input) => setTask(input.target.value)}
                        placeholder="Enter Task">
                    </input>
                    <button onClick={sumExpense}>Add Expense</button>
                </div>
                <div className="results">
                    {taskExpense.map((result, index) => (
                        <div>
                        <p>Activity: {result.task}</p>
                        <p>Cost: {result.expense}</p>
                        </div>
                    ))}
                <div className="totalexpense">
                    <p>Total Expense: {totalExpense}</p>
                </div>
            </div>
            </div>
        </>
    )
}

export default ExpenditureTracker;