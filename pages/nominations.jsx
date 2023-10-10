import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/services/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

function Nominations() {
  const { user } = useAuth();
  const { toast } = useToast();

  const userToken = user?.token;
  const userEmail = user?.email;

  const [loading, setLoading] = useState(true);
  const [nominationsData, setNominationsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpno, setIsEmpno] = useState('');
  const [positions, setPositions] = useState([]); // State for positions
  const [selectedPosition, setSelectedPosition] = useState(''); // State for selected position

  console.log(userToken)


  // CSS class for green rows
  const greenRowClass = 'green-row';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://virtual.chevroncemcs.com/voting/nominations', {
          params: { email: userEmail },
          headers: { Authorization: `Bearer ${userToken}` },
        });

        console.log(response.data)

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

  //Fetch positions data from the API
  useEffect(() => {
    async function fetchPositions() {
      try {
        const response = await axios.get('https://virtual.chevroncemcs.com/voting/position');

        console.log('New Norm',response)

        if (response.status === 200) {
          setPositions(response.data.data);
        } else {
          console.error('API request failed with status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    }

    fetchPositions();
  }, []);

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

  const handleSetNomination = async () => {
    try {
      setIsLoading(true); // Start loading
  
      const response = await axios.post(
        'https://virtual.chevroncemcs.com/voting/setnominated',
        {
          email: userEmail,
          empno: isEmpno,
          positionId: selectedPosition,
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
        // Reload the page to reflect the changes
        window.location.reload();
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
    } finally {
      setIsLoading(false); // Stop loading, whether successful or not
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
                    <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : ''} ${item.nominated === 1 ? 'bg-green-500' : ''}`}>
                      <td className="px-6 py-4">{item.empno}</td>
                      {positionHeaders.map((header, headerIndex) => (
                        <td key={headerIndex} className="px-6 py-4">
                          {item.counts.find((countItem) => countItem.positionName === header)?.count || 0}
                        </td>
                      ))}
                      <td>
                      <Dialog>
                    <DialogTrigger asChild>
                    <Button className="" onClick={() => setIsEmpno(item.empno)}>Nominate</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                      <DialogHeader>
                        <DialogTitle className="">Nominate your Candidate</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Candidate Employee No.</Label>
                          <Input
                            type="text"
                            value={isEmpno}
                            onChange={(e) => setIsEmpno(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="positions" className="text-right">Positions</Label>
                          <select
          id="positions"
          className="col-span-3 border p-2 rounded-md"
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
        >
          <option value="">Select Position</option>
          {positions.map((position) => (
            <option key={position.positionId} value={position.id}>
              {position.name}
            </option>
          ))}
        </select>
                        </div>
                        {/* <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Candidate Employee No.</Label>
                          <Input
                            type="text"
                            value={voterno}
                            onChange={(e) => setVoterNo(e.target.value)}
                            className="col-span-3"
                          />
                        </div> */}
                      </div>
                      <DialogFooter>
                      <Button onClick={handleSetNomination} className="mb-10" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Setting Nominee...
                          </>
                        ) : (
                          <>
                            Set Nominee
                          </>
                        )}
                      </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
