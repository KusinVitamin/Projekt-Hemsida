library ieee;          
use ieee.std_logic_1164.all; 

entity ARITH_tb is
end ARITH_tb;

architecture stimulus of ARITH_tb is
  component ARITH
    port  (A, B : in STD_LOGIC_VECTOR(3 downto 0);
		   Sub : in STD_LOGIC;
           R: out STD_LOGIC_VECTOR(3 downto 0);
		   V,C: out STD_LOGIC);
  end component;
  
  signal A, B: STD_LOGIC_VECTOR (3 downto 0);
  signal Sub:  STD_LOGIC;
  signal R: STD_LOGIC_VECTOR(3 downto 0);
  signal V,C: STD_LOGIC;

  --signal test_variable : STD_LOGIC;
  
begin
  ARITH_instance: ARITH port map( 
	A => A, 
	B => B,   
	Sub => Sub, 
	R => R, 
	V => V, 
	C => C);
	
  process
    constant PERIOD: time := 80 ns;
  begin
    --test_variable <= '1';
    --wait for PERIOD;
    --assert test_variable = '1';

    -- 4+3=7 KORREKT
    A <= "0100"; B <= "0011"; Sub <= '0';
    wait for PERIOD;
    assert R = "0111";
    assert V = '0';
    assert C = '0';
    
    -- 7+2 = -7 INKORREKT
    A <= "0111"; B <= "0010"; Sub <= '0';
    wait for PERIOD;
    assert R = "1001";
    assert V = '0' report "V error" severity error; -- C=1 TEST FÖR FEL;
    assert C = '1' report "C error" severity error; -- C=0 TEST FÖR FEL;
    
    A <= "1000"; B <= "1000"; Sub <= '0';
    wait for PERIOD;
    
    A <= "1100"; B <= "1100"; Sub <= '0';
    wait for PERIOD;
    
    A <= "0100"; B <= "0011";Sub <= '0';
    wait for PERIOD;
    
    A <= "0111"; B <= "0010"; Sub <= '0';
    wait for PERIOD;
    
    -- 7-2=5 KORREKT
    A <= "0111"; B <= "0010"; Sub <= '1';
    wait for PERIOD;
    assert R = "0101";
    assert V = '0';
    assert C = '1';
    
    -- 0-(-8)=-8 INKORREKT
    A <= "0000"; B <= "1000"; Sub <= '1';
    wait for PERIOD;
    assert R = "1000";
    assert V = '1';
    assert C = '0';

    -- put breakpoint to line below
    wait;
  end process;  
end stimulus;





