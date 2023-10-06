import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/services/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

function Nominations() {
  const { user } = useAuth();
  const { toast } = useToast();

  const userToken = user?.token;
  const userEmail = user?.email;

  const [loading, setLoading] = useState(true);
  const [nominationsData, setNominationsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://virtual.chevroncemcs.com/voting/nominations', {
          params: { email: userEmail },
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (response.data.error === false) {
          setNominationsData(response.data.data);
          setLoading(false);
        } else {
          console.error('API request failed with error:', response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userToken, userEmail]);

  const getPositionHeaders = () => {
    const positionNames = new Set();

    nominationsData.forEach((item) => {
      item.counts.forEach((countItem) => {
        if (countItem.count > 0) {
          positionNames.add(countItem.positionName);
        }
      });
    });

    return Array.from(positionNames);
  };

  const positionHeaders = getPositionHeaders();

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
        console.log('Nomination set successfully:', response.data);
        toast({
          title: 'Nominations',
          description: `${response.data.message}`,
        });
      } else {
        console.error('API request failed with status:', response.status);
      }
    } catch (error) {
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
