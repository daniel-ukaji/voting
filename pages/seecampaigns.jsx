import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MemberNavbar from '@/components/MemberNavbar';
import { useNewAuth } from '@/services/NewAuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

function Seecampaigns() {
  const [campaignData, setCampaignData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [empno, setEmpno] = useState(''); // State for empno
  const [positions, setPositions] = useState([]); // State for positions
  const [selectedPosition, setSelectedPosition] = useState('');
  const [voterno, setVoterNo] = useState(''); // State for positions
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const {code} = useNewAuth();

  console.log(code);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://virtual.chevroncemcs.com/voting/campaign`
      );
      const data = response.data;
      console.log(data);

      setCampaignData(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await axios.get('https://virtual.chevroncemcs.com/voting/positions');
      const data = response.data;
      setPositions(data); // Assuming the positions data is an array of objects with an 'id' and 'name' property.
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  const handleVote = async () => {
    try {
      setIsLoading(true); // Start loading
  
      // Log the payload before sending the POST request
      console.log('Vote Payload:', {
        empno: empno,
        positionId: selectedPosition,
        votedno: voterno,
      });
  
      const response = await axios.post(
        'https://virtual.chevroncemcs.com/voting/vote',
        {
          empno: empno,
          positionId: selectedPosition,
          votedno: voterno,
        },
        {
          headers: {
            Authorization: `Bearer ${code}`, // Add your token here
          },
        }
      );
  
      console.log(response);
  
      if (response.status === 200) {
        // Successful voting, handle as needed
        console.log('Vote successful');
        toast({
          title: 'Voting',
          description: `${response.data.message}`,
        });
      } else {
        // Handle errors, e.g., show an error message
        console.error('Vote failed:', response.data);
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: 'There was a problem.',
        description: `${response.data.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  
  

  useEffect(() => {
    fetchData();
    fetchPositions();
  }, [page]);

  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100 &&
        hasMore
      ) {
        setPage(page + 1);
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, page]);

  return (
    <div>
      <MemberNavbar />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='mt-20'>
          {campaignData.map((campaign) => (
            <div key={campaign.empno} className='flex justify-center'>
              <Card className="w-2/6 flex flex-col justify-center items-center mb-5">
                <div className='relative w-full h-[20rem]'>
                  <Image alt="" src={campaign.image} layout='fill' objectFit="cover" className='h-[300px] object-cover' />
                </div>
                <div className='flex flex-col justify-center items-center'>
                  <p className='mt-5 mb-2 text-gray-600 font-bold'>{campaign.name}</p>
                  <p className='mt-1 mb-2 text-gray-600 font-semibold'>Employee Number - {campaign.empno}</p>
                  <p className='mb-5 text-gray-700 text-sm mt-2'>{campaign.message}</p>
                  {/* <p>Nominated: {campaign.nominated}</p>
                  <p>Position ID: {campaign.positionId}</p> */}
                </div>
                <div className='mb-5 w-1/2'>
                  {/* <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedPosition(campaign.positionId); // Set the selected position
                    }}
                  >
                    Vote
                  </Button> */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">Vote</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                      <DialogHeader>
                        <DialogTitle className="">Nominate your Candidate</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Your Employee No.</Label>
                          <Input
                            type="text"
                            value={empno}
                            onChange={(e) => setEmpno(e.target.value)}
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
                            {campaignData.map((position) => (
                              <option key={position.id} value={position.positionId}>
                                {position.position_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Candidate Employee No.</Label>
                          <Input
                            type="text"
                            value={voterno}
                            onChange={(e) => setVoterNo(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                      <Button onClick={handleVote} className="mb-10" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Voting...
                          </>
                        ) : (
                          <>
                            Vote
                          </>
                        )}
                      </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Seecampaigns;
