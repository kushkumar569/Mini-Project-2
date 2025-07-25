
export async function DeleteSchedules(courseCode) {
    try {
        const response = await fetch(`https://mini-project-2-6a2p.onrender.com/Delete/DeleteRelationalSchedule`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ courseCode }),
        });

        if (response.ok) {
            console.log("Class deleted successfully");
        } else {
            const errorText = await response.text();
            console.error("Failed to delete:", errorText);
        }
    } catch (error) {
        console.error("Delete request failed:", error);
    }
}
