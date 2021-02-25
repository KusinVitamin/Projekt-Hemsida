
library IEEE;
use IEEE.std_logic_1164.all;

entity FULL_ADDER is
  port(A,B,Cin : in STD_LOGIC;
       R, Cout : out STD_LOGIC);
end entity FULL_ADDER;


architecture beteende of FULL_ADDER is
signal xor1,and1,and2 : STD_LOGIC;
begin
  xor1 <= A xor B;
  and1 <= xor1 and Cin;
  and2 <= A and B;
  R <= xor1 xor Cin;
  Cout <= and1 or and2;
end architecture beteende;


