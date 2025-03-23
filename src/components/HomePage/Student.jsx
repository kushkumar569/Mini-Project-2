import { useSetRecoilState, useRecoilValue } from "recoil";
import { TeacherLatitude, TeacherLongitude } from "../atoms/location";
import Header from "../Header";
import { live, Attend } from "../atoms/attendence";
import { useState, useEffect } from "react";

function Student() {
    return (
        <>
            <Header />
            <Main />
        </>
    );
}

function Main() {
    const setAttendence = useSetRecoilState(Attend);
    const live2 = useRecoilValue(live);
    const attend = useRecoilValue(Attend);
    const [numbers, setNumbers] = useState(attend);

    const latTeacher = useRecoilValue(TeacherLatitude);
    const lonTeacher = useRecoilValue(TeacherLongitude);

    const [underRange, setUnderRange] = useState(false);
    const [isFind, setIsFind] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function location() {
            let lat = null;
            let lon = null;

            async function getLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(await showPosition,await showError);
                } else {
                    setIsFind(false);
                }
            }

            async function showPosition(position) {
                lat = position.coords.latitude;
                lon = position.coords.longitude;
                setIsFind(true);
                // console.log(`${latTeacher} and ${lonTeacher} + ${lat} and ${lon}`);               
                const distance = await vincenty(latTeacher, lonTeacher, lat, lon);
                console.log(distance);         
                if (distance <= 200) {
                    setUnderRange(true);
                    setMessage("Inside Range - Present");
                } else {
                    setUnderRange(false);
                    setMessage("Out of Range");
                }
            }

            function showError(error) {
                setIsFind(false);
                    setMessage("Failed to fetch location, Turn On GPS and Try Again.");
            }

            await getLocation();

            // if (isFind) {
            //     console.log(`${latTeacher} and ${lonTeacher} + ${lat} and ${lon}`);               
            //     const distance = await vincenty(latTeacher, lonTeacher, lat, lon);
            //     console.log(distance);          
            //     if (distance <= 100) {
            //         setUnderRange(true);
            //         setMessage("Inside Range - Present");
            //     } else {
            //         setUnderRange(false);
            //         setMessage("Out of Range");
            //     }
            // } else {
            //     setMessage("Failed to fetch location, Turn On GPS and Try Again.");
            // }
        }

        location();
    }, [latTeacher, lonTeacher, isFind]);

    async function vincenty(lat1, lon1, lat2, lon2) {
        const a = 6378137; // semi-major axis (meters)
        const f = 1 / 298.257223563; // flattening
        const b = (1 - f) * a;
        
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const L = (lon2 - lon1) * Math.PI / 180;
      
        const tanU1 = (1 - f) * Math.tan(φ1);
        const tanU2 = (1 - f) * Math.tan(φ2);
        
        const cosU1 = 1 / Math.sqrt(1 + tanU1 * tanU1);
        const sinU1 = tanU1 * cosU1;
        const cosU2 = 1 / Math.sqrt(1 + tanU2 * tanU2);
        const sinU2 = tanU2 * cosU2;
      
        let λ = L;
        let sinσ, cosσ, σ, sinα, cos2α, cos2σm, C, sinλ, cosλ;
        
        let iterLimit = 1000; // Prevents infinite loops if calculation goes wrong
        while (iterLimit-- > 0) {
          sinλ = Math.sin(λ); 
          cosλ = Math.cos(λ);
          sinσ = Math.sqrt((cosU2 * sinλ) * (cosU2 * sinλ) + (cosU1 * sinU2 - sinU1 * cosU2 * cosλ) * (cosU1 * sinU2 - sinU1 * cosU2 * cosλ));
          cosσ = sinU1 * sinU2 + cosU1 * cosU2 * cosλ;
          σ = Math.atan2(sinσ, cosσ);
          sinα = cosU1 * cosU2 * sinλ / sinσ;
          cos2α = 1 - sinα * sinα;
          cos2σm = cosσ - 2 * sinU1 * sinU2 / cos2α;
          C = f / 16 * cos2α * (4 + f * (4 - 3 * cos2α));
          λ = L + (1 - C) * f * sinα * (σ + C * sinσ * (cos2σm + C * cosσ * (-1 + 2 * cos2σm * cos2σm)));
      
          if (Math.abs(λ - L) < 1e-12) break;  // Converged
        }
      
        const u2 = cos2α * (a * a - b * b) / (b * b);
        const A = 1 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
        const B = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
        
        const Δσ = B * sinσ * (cos2σm + B / 4 * (cosσ * (-1 + 2 * cos2σm * cos2σm) - B / 6 * cos2σm * (-3 + 4 * sinσ * sinσ) * (-3 + 4 * cos2σm * cos2σm)));
      
        const distance = b * A * (σ - Δσ); // Distance in meters
        
        return distance;
      }

    return (
        <div className="bg-white flex items-center justify-center p-6">
            <div className="relative w-full max-w-lg bg-gray-200 rounded-2xl shadow-lg flex flex-col p-6 items-center">
                <div className="absolute top-1 left-2 flex items-center space-x-1">
                    <img src="/logo.png" alt="Logo" className="w-14 h-14" />
                    <span className="text-gray-500 text-lg font-semibold">
                        Geo-Fencing Attendance Manager
                    </span>
                </div>
                <div className="mt-8 color-red">
                    {underRange && live2 ? <Btn /> : <Error msg={message} live2={live2} />}
                </div>
            </div>
        </div>
    );
}

function Btn() {
    const setAttendence = useSetRecoilState(Attend);
    const attend = useRecoilValue(Attend);

    function mark() {
        const updatedNumbers = Array.from(new Set([...attend, 15])).sort((a, b) => a - b);
        setAttendence(updatedNumbers);
        console.log("Updated Attendance:", updatedNumbers);
    }

    return (
        <button
            className="bg-green-600 hover:bg-orange-400 active:bg-orange-400 text-white py-2 px-6 rounded-md font-semibold mb-4 w-full mt-16"
            onClick={mark}
        >
            Mark Attendance
        </button>
    );
}

function Error({ msg, live2 }) {
    return (
        <span className="color-red font-semibold">
            {live2 ? msg : "No attendance marked now"}
        </span>
    );
}

export default Student;
