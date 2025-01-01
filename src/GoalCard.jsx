import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import debounce from 'lodash.debounce';

const GoalCard = ({ onClose }) => {
  const { date } = useParams(); // Get the date from the URL
  const [goalText, setGoalText] = useState("");

  useEffect(() => {
    const fetchGoal = async () => {
      const dayRef = doc(db, "calendarDays", `2025-${date.replace('-', '-')}`);
      const daySnap = await getDoc(dayRef);
      if (daySnap.exists()) {
        setGoalText(daySnap.data().dailyGoal || "");
      }
    };

    fetchGoal();
  }, [date]);

  const updateGoalInDb = useCallback(
    debounce(async (newGoalText) => {
      const dayRef = doc(db, "calendarDays", `2025-${date.replace('-', '-')}`);
      await updateDoc(dayRef, { dailyGoal: newGoalText });
    }, 500), // Adjust the delay (milliseconds) as needed
    [date]
  );

  const handleGoalChange = (e) => {
    setGoalText(e.target.value);
    updateGoalInDb(e.target.value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
      <div className="bg-yellow-50 shadow-md rounded-md p-4 sm:p-6 md:p-8 w-5/6 sm:w-3/4 md:w-1/2 lg:w-1/3">
        <textarea
          className="w-full h-48 sm:h-64 p-2 sm:p-3 bg-yellow-50 border-none focus:ring-0 resize-none  text-lg sm:text-xl md:text-2xl text-gray-700"
          placeholder="🎯 Goal for the day"
          value={goalText}
          spellCheck="false"
          onChange={handleGoalChange}
          // onBlur={saveGoal} // Saving is now handled by the debounced function
        ></textarea>
        <div className="w-full h-px bg-gray-300 mt-2 sm:mt-3"></div>
        <div className="mt-4 sm:mt-6 text-right">
          <button
            className="bg-transparent hover:bg-gray-100 py-2 px-4 rounded focus:outline-none focus:shadow-outline text-gray-700 transition-colors duration-200 text-base sm:text-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
     
    </div>
  );
};

export default GoalCard;