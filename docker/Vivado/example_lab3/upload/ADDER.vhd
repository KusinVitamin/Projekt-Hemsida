
library IEEE;
use IEEE.std_logic_1164.all;

entity ADDER is
  port(A,B: in std_logic_vector	(3 downto 0);
	   Cin : in STD_LOGIC;
       R: out std_logic_vector (3 downto 0);
	   V,C : out STD_LOGIC);
end entity ADDER;


architecture beteende of ADDER is
	COMPONENT FULL_ADDER port(A,B,Cin: in STD_LOGIC;
	Cout, R: out STD_LOGIC); END COMPONENT;
    signal Carry:STD_LOGIC_VECTOR (4 downto 0);
begin
	Carry(0)<= Cin;
	adder: for i in 0 to 3 generate
		adder_instance: FULL_ADDER port map(A => A(i), B => B(i), Cin => Carry(i), R => R(i), Cout => Carry(i+1));end generate;
	V <= Carry(3) xor Carry(4);
	C <= Carry(4);
end architecture beteende;


