LIBRARY ieee;
use ieee.std_logic_1164.all;
 
ENTITY test_bench IS
END test_bench;
 
ARCHITECTURE behavior OF test_bench IS 

-- First, declare the lower-level entity (Component).



-- Next, declare some local signals to assign values to and observe...
-- Delete the signal below and make your own, it is only there to show you the structure of the test bench.
    signal test_variable : STD_LOGIC;
    
    
    begin
-- Create an instance of the component under test (Port map).


-- Now define a process to apply some stimulus over time...
	process
	constant PERIOD: time := 40 ns;
	
    begin
    
        -- Remove code below and add your own tests to show your component implementations are correct.
        test_variable <= '1';
        wait for PERIOD;
        -- What an assert looks like. Check VHDL documentation for more information.
        assert test_variable = '0';
        
        
        -- Don't delete this wait the simulation will run forever and CI testing breaks.
        wait;
    
    end process;

END;
