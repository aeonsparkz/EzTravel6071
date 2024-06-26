import { useState } from "react";
import "./ExpenditureTracker.css";

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
        setTaskExpense([
            ...taskExpense,
            { expense: additionalCost, task: task }
        ])
        setTotalExpense(additionalCost + totalExpense);
        setTask('')
        setCost('');
    }

    return (
        <>
            <div className="header">
                <h1>Expenditure Tracker</h1>
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
                        onChange={(e) => setTask(e.target.value)}
                        placeholder="Enter Task">
                    </input>
                    <button onClick={sumExpense}>Add Expense</button>
                </div>
                <div className="results">
                    {taskExpense.map((result, index) => (
                        <p>Task: {result.task}, cost: {result.expense}</p>
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