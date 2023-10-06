import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/services/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

function Nominations() {
  const [nominationsData, setNominationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast()

  const userToken = user?.token;
  const userEmail = user?.email;

  useEffect(() => {
    // Define the request body
    const requestBody = {
      email: userEmail,
    };

    // Define headers with the Authorization token
    const headers = {
      Authorization: `Bearer ${userToken}`,
    };

    // Make the GET request to the API endpoint with authorization headers
    axios
      .get('https://virtual.chevroncemcs.com/voting/nominations', {
        params: requestBody,
        headers: headers,
      })
      .then((response) => {
        if (response.status === 200) {
          // Data has been successfully fetched
          setNominationsData(response.data.data);
          setLoading(false);
          
        } else {
          // Handle API request failure here
          console.error('API request failed with status:', response.status);
          setLoading(false);
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [userToken, userEmail]); // Include userToken and userEmail as dependencies

  // Determine unique position names with counts greater than zero
  const positionNames = nominationsData?.reduce((names, item) => {
    item.counts.forEach((countItem) => {
      if (countItem.count > 0) {
        names.add(countItem.positionName);
      }
    });
    return names;
  }, new Set());

  // Convert the set of position names to an array for rendering headers
  const positionHeaders = Array.from(positionNames);

  // Function to handle the "Set Nomination" button click
  const handleSetNomination = async (empno, positionId) => {
    try {
      const response = await axios.post(
        'https://virtual.chevroncemcs.com/voting/setnominated',
        {
          email: userEmail,
          empno: empno,
          positionId: positionId,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Handle success, you can update your UI as needed
        console.log('Nomination set successfully:', response.data);
        toast({
            title: 'Nominations',
            description: `${response.data.message}`,
          });
      } else {
        // Handle API request failure here
        console.error('API request failed with status:', response.status);
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('Error setting nomination:', error);
      toast({
        title: 'There was a problem.',
        description: 'There was an error setting your nomination',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-20 mb-20">
        <h1 className="text-3xl font-semibold mb-4">Nominations</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-2">Nominations Data</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-200 text-left">Employee Number</th>
                    {positionHeaders.map((header, index) => (
                      <th key={index} className="px-6 py-3 bg-gray-200 text-left">
                        {header}
                      </th>
                    ))}
                    <th className="px-6 py-3 bg-gray-200 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {nominationsData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                      <td className="px-6 py-4">{item.empno}</td>
                      {positionHeaders.map((header, headerIndex) => (
                        <td key={headerIndex} className="px-6 py-4">
                          {item.counts.find((countItem) => countItem.positionName === header)?.count || 0}
                        </td>
                      ))}
                      <td>
                        <Button
                          onClick={() => handleSetNomination(item.empno, 1)} // Example: Setting positionId to 1
                        >
                          Set Nomination
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Nominations;
