----------------------------------------------------------------------------------
-- Company: LTU
-- Engineer: Rickard Bemm
-- 
-- Create Date: 07.05.2019 15:09:23
-- Design Name: 
-- Module Name: Adder_32Bit - Behavioral
-- Project Name: 
-- Target Devices: 
-- Tool Versions: 
-- Description: 
-- 
-- Dependencies: 
-- 
-- Revision:
-- Revision 0.01 - File Created
-- Additional Comments:
-- 
----------------------------------------------------------------------------------


library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity Adder_32Bit is
    Port ( A : in STD_LOGIC_VECTOR (31 downto 0);
           B : in STD_LOGIC_VECTOR (31 downto 0);
           C_in : in STD_LOGIC;
           R : out STD_LOGIC_VECTOR (31 downto 0);
           C_out, V : out STD_LOGIC);
end Adder_32Bit;

architecture Behavioral of Adder_32Bit is
    
    component FullAdder port (
        A : in STD_LOGIC;
        B : in STD_LOGIC;
        C_in : in STD_LOGIC;
        R :  out STD_LOGIC;
        C_out :  out STD_LOGIC);
    end component;
    
    signal C_out_sig : STD_LOGIC_VECTOR (32 downto 0);
begin
    
    C_out_sig(0) <= c_in;
    Adder: for i in 0 to 31 generate
        Adder_instance: FullAdder port map(
            A      => A(i),
            B      => B(i),
            C_in   => C_out_sig(i),
            R      => R(i),
            C_out  => C_out_sig(i+1));
    end generate;

    C_out <= C_out_sig(32);
    V <= C_out_sig(32) xor C_out_sig(31);

end Behavioral;
