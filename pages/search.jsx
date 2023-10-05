import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { SearchIcon } from 'lucide-react';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNewAuth } from '@/services/NewAuthContext';
import MemberNavbar from '@/components/MemberNavbar';
import { useToast } from '@/components/ui/use-toast';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [positions, setPositions] = useState([]); // State for positions
  const [selectedPosition, setSelectedPosition] = useState(''); // State for selected position
  const [empno, setEmpno] = useState(''); // State for empno
  const [nomineeno, setNomineeno] = useState(''); // State for nomineeno
  const apiUrl = 'https://virtual.chevroncemcs.com/voting/member';
  const { toast } = useToast();

  const {code} = useNewAuth()
  console.log(code)

  const token = "025209";

  const handleNomination = async () => {
    try {
      // Check if any of the required fields are empty
      if (!empno || !selectedPosition || !nomineeno) {
        alert('Please fill in all fields before submitting.');
        return;
      }
  
      // Log the values after setting the state
      console.log('Empno:', empno);
      console.log('Selected Position:', selectedPosition);
      console.log('Nominee No:', nomineeno);

      // Log the payload you're sending
      const payload = {
        empno: empno,
        positionId: selectedPosition,
        nomineeno: nomineeno,
      };
      console.log('Payload:', payload);
  
      // Set the headers with the authorization token
      const headers = {
        Authorization: `Bearer ${code}`,
      };
  
      // Send the GET request to the nomination API endpoint
      const response = await axios.get('https://virtual.chevroncemcs.com/voting/nominate', {
        params: payload,
        headers,
      });

      console.log('Nomination Response:', response.data);
  
      if (response.status === 200) {
        // alert('Your nomination has been registered!');
        // Clear the form fields after a successful nomination
        setEmpno('');
        setSelectedPosition('');
        setNomineeno('');
        toast({
          title: 'Nomination',
          description: `${response.data.message}`,
        });
      } else {
        console.error('Nomination failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error nominating:', error);
      toast({
        title: 'There was a problem.',
        description: 'There was an error nominating your candidate.',
        variant: 'destructive',
      });
    }
  };

  

  // Fetch positions data from the API
  useEffect(() => {
    async function fetchPositions() {
      try {
        const response = await axios.get('https://virtual.chevroncemcs.com/voting/position');

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

  useEffect(() => {
    // Define a function to fetch search results
    async function fetchSearchResults() {
      try {
        if (searchTerm.trim() === '') {
          setSearchResults([]); // Clear results if the search term is empty
          return;
        }

        // Append the search term to the URL
        const response = await axios.get(`${apiUrl}/${searchTerm}`);

        if (response.status === 200) {
          setSearchResults(response.data.data);
          console.log('API Response:', response.data); // Log the response
        } else {
          console.error('API request failed with status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    // Call fetchSearchResults when searchTerm changes
    fetchSearchResults();
  }, [searchTerm]);

  return (
    <div>
      {/* <Navbar /> */}
      <MemberNavbar />
      <div className='mt-24 flex justify-center items-center'>
        <div className="relative w-1/2">
          <input
            type="text"
            className="py-3 px-3 rounded-md w-full outline-none search border shadow-xl border-gray-600 pl-10"
            placeholder="Search Nominees"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <SearchIcon />
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-3xl mx-auto">
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((result) => (
              <li className='font-bold flex justify-between items-center' key={result.id}>
                <div className='flex flex-col'>
                    <div>
                    {result.name}
                    </div>                
                {result.empno}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Nominate</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                      <DialogTitle className="">Nominate your Candidate</DialogTitle>
    
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                          Your Employee No.
                        </Label>
                        <Input
                          type="text"
                          value={empno}
                          onChange={(e) => setEmpno(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="positions" className="text-right">
                          Positions
                        </Label>
                        <select
                          id="positions"
                          className="col-span-3 border p-2 rounded-md"
                          value={selectedPosition}
                          onChange={(e) => setSelectedPosition(e.target.value)}
                        >
                          <option value="">Select Position</option>
                          {positions.map((position) => (
                            <option key={position.id} value={position.id}>
                              {position.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                          Nominee Employee No.
                        </Label>
                        <Input
                        type="text"
                          value={nomineeno}
                          onChange={(e) => setNomineeno(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleNomination}>
                        Nominate
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default Search;
