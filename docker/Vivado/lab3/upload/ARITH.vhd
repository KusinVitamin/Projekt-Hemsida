
library IEEE;
use IEEE.std_logic_1164.all;

entity ARITH is
  port(A,B: in std_logic_vector	(3 downto 0);
	   Sub : in STD_LOGIC;
       R: out std_logic_vector (3 downto 0);
	   V,C : out STD_LOGIC);
end entity ARITH;


architecture beteende of ARITH is
	COMPONENT ADDER port(A,B : in std_logic_vector (3 downto 0);
	Cin: in STD_LOGIC;
	R: out std_logic_vector(3 downto 0);
	V,C: out STD_LOGIC); END COMPONENT;
    signal xor1:STD_LOGIC_VECTOR (3 downto 0);
begin
	xor1(0) <= Sub xor B(0);
	xor1(1) <= Sub xor B(1);
	xor1(2) <= Sub xor B(2);
	xor1(3) <= Sub xor B(3);
	A1:	ADDER PORT MAP(A => A, B => xor1, Cin => Sub, R => R, C => C, V => V);
end architecture beteende;


