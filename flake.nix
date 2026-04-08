{
  description = "bitwarden-alias-provider development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs =
    { self, nixpkgs }:
    let
      supportedSystems = [
        "x86_64-linux"
        "x86_64-darwin"
      ];
      forEachSupportedSystem =
        f:
        nixpkgs.lib.genAttrs supportedSystems (
          system:
          f {
            pkgs = import nixpkgs { inherit system; };
          }
        );
    in
    {
      devShells = forEachSupportedSystem (
        { pkgs }:
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              bun
              uv
            ];

            shellHook = /* bash */ ''
              if [ -f ".env" ]; then
                source .env
              fi

              cd server

              if [ ! -d ".venv" ]; then
                uv venv
              fi

              source .venv/bin/activate
              uv pip install -r pyproject.toml

              cd ../web
              bun install

              cd ..

              echo ""
              echo "========================================================"
              echo "bitwarden-alias-provider development environment loaded!"
              echo "To start all services, run: docker-compose up"
              echo "========================================================"
              echo ""
            '';
          };
        }
      );
    };
}
